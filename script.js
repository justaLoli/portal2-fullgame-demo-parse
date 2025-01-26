import {
    DemoMessages,
    SourceDemoParser,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/mod.js";
import {
    isSarMessage,
    readSarMessages,
    SarDataType
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/utils/mod.js";
import {
    SarTimer,
    SourceTimer,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/speedrun/mod.js";


const dropZone = document.getElementById("drop-zone");
const clearButton = document.getElementById("clear-btn");
const copyButton = document.getElementById("copy-btn");
const autoClearCheckbox = document.getElementById('auto-clear');
const hideDemosCheckbox = document.getElementById('hide-demos');
const formatTimeCheckbox = document.getElementById('format-time');
const fileTableBody = document.querySelector("#file-table tbody");
const fileTableHead = document.querySelector("#file-table thead");

let fileGroupedByFolder = {};

// 排序文件列表，按数字顺序排序
const sortFiles = (fileList) => {
    fileList.sort((a, b) => {
        const matchA = a.file.name.match(/_(\d+)\.dem$/);
        const matchB = b.file.name.match(/_(\d+)\.dem$/);
        if (matchA && matchB) {
            return parseInt(matchA[1]) - parseInt(matchB[1]);
        }
        if (!matchA && matchB) {
            return -1;
        }
        if (matchA && !matchB) {
            return 1;
        }
        return a.file.name.localeCompare(b.file.name);
    });
};

//Table Editing
const clearTable = () => {
    fileTableBody.innerHTML = '';
    fileTableHead.innerHTML = '';
};
const addTableTitleRow = (titles) => {
    const headerRow = document.createElement("tr");
    titles.forEach( title => {
        const headerCell = document.createElement("th");
        headerCell.innerHTML = title;
        headerRow.appendChild(headerCell);
    });
    fileTableHead.appendChild(headerRow);
};
const createLeftColumn = () => {
    clearTable();
    ["Folder","Runner","Speedrun Time","Demo Time","SAR Timing"].forEach( content=>{
        const row1 = document.createElement("tr");
        const cell1 = document.createElement("th");
        cell1.innerHTML = content;
        row1.appendChild(cell1);
        fileTableHead.appendChild(row1);
    });
    Object.values(mapNameMapping).forEach(mapName=>{
        const row1 = document.createElement("tr");
        row1.classList.add("map-row");
        const cell1 = document.createElement("td");
        cell1.innerHTML = mapName;
        row1.appendChild(cell1);
        const row2 = document.createElement("tr");
        row2.classList.add("demo-row")
        const cell2 = document.createElement("td");
        cell2.innerHTML = "Demos";
        row2.appendChild(cell2);
        fileTableBody.appendChild(row1);
        fileTableBody.appendChild(row2);
    });
}
const addTableColumn = (titleList, groupedFileList) => {
    const rows = fileTableBody.rows;
    if (rows.length === 0){
        clearTable();
        createLeftColumn();
    }
    titleList.forEach( (title,index) =>{
        const cell = document.createElement("th");
        cell.textContent = title;
        fileTableHead.rows[index]?.appendChild(cell);
    });
    groupedFileList.forEach( (group, index) => {
        const timeCell = document.createElement("td");
        //put two possible time format here
        const div1 = document.createElement("div");
        div1.classList.add("simple-time");
        div1.textContent = (Math.round(group.sumTick / 60 * 1000) / 1000).toFixed(3);
        const div2 = document.createElement("div");
        div2.classList.add("formatted-time");
        div2.textContent = formatTime(group.sumTick/60);
        timeCell.appendChild(div1);timeCell.appendChild(div2);
        rows[index * 2]?.appendChild(timeCell);
        const demosCell = document.createElement("td");
        demosCell.innerHTML = group.files.map(file => file.file.name).join("<br>");
        rows[index * 2 + 1]?.appendChild(demosCell);
    });
}

// Parse and Split and Timing
const parser = SourceDemoParser.default();
const speedrunTimer = SourceTimer.default();
const sarTimer = SarTimer.default();
let player = "Unknown Player";
const tryParseDemo = (ev, fullAdjustment = true) => {
    let demo = null;
    try {
        demo = parser.parse(ev.target.result);

        // Fix message ticks
        demo.detectGame().adjustTicks();
        
        if (fullAdjustment) {
            // Fix header
            demo.adjustRange();

            // Adjust 0-tick demos manually
            if (demo.playbackTicks === 0) {
                const ipt = demo.getIntervalPerTick();
                demo.playbackTicks = 1;
                demo.playbackTime = ipt;
            } else {
                // Speedrun rules apply here
                demo.speedrun = speedrunTimer.time(demo);

                // Check SAR support
                demo.sar = sarTimer.time(demo);
            }
        }
    } catch (error) {
        console.error(error);
    }
    return demo;
};
const parseListFiles = async (fileList)=>{
    return new Promise((resolve)=>{
        let count=0;
        if(fileList.length === 0){resolve();}
        for (const file of fileList) {
            if(file.parsed){
                if(++count === fileList.length){
                    resolve();
                }
                continue;
            }
            const reader = new FileReader();
            reader.onload = (ev)=>{
                const demo = tryParseDemo(ev);
                if(demo != null){
                    file.mapName = demo.mapName ?? "unknown";
                    file.playbackTicks = demo.playbackTicks ?? 0;
                    file.player = demo.clientName;
                    file.parsed = true;
                }

                if(++count === fileList.length){
                    tuneDemoTime(fileList);
                    resolve();
                }

            };
            reader.readAsArrayBuffer(file.file);
        }
    });
};
const getSARSplitsInfo = async (fileList) => {
    const file = fileList[fileList.length - 1];
    
    // 只有在 sarSplit 未定义时，才会进行读取
    if (file.sarSplit !== undefined && file.sarSplit !== null) {
        return; // 如果已经有 sarSplit 数据，直接返回
    }
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        // 异步加载文件
        reader.onload = (ev) => {
            const demo = tryParseDemo(ev);
            if (demo === null || demo === undefined) {
                resolve(); // 读取失败或无法解析时，返回
                return;
            }
            
            const messages = readSarMessages(demo);
            const speedrun = messages.find(isSarMessage(SarDataType.SpeedrunTime));
            if (speedrun === undefined || speedrun === null) {
                resolve(); // 未找到 speedrun 信息时，返回
                return;
            }
            
            file.sarSplits = speedrun.splits; // 赋值 sarSplits
            resolve(); // 完成处理后，调用 resolve
        };
        
        // 触发文件读取
        reader.readAsArrayBuffer(file.file);
    });
};

//this is bad and will not add to correct time :(
const tuneDemoTime = (fileList)=>{
    let sar_speedrun_demo_offset = 18637; // magic number :)
    const container_ride = fileList.find(
        (element) => element.mapName === "sp_a1_intro1"
    );
    if(container_ride){
        container_ride.playbackTicks += sar_speedrun_demo_offset;
    }
    const tube_ride = fileList.find(
        (element) => element.mapName === "sp_a2_bts6"
    );
    if(tube_ride){tube_ride.playbackTicks = 3112;}
    const long_fall = fileList.find(
        (element) => element.mapName === "sp_a3_00"
    );
    if(long_fall){long_fall.playbackTicks = 4666;}
};

const groupFilesToSplits_Naive = (fileList) => {
    const groupedFileList = [];
    groupedFileList.length = 0; // clear list
    let group;
    const mapSet = new Set();
    fileList.forEach(file=>{
        if(!mapSet.has(file.mapName)){
            mapSet.add(file.mapName);
            if(group){
                groupedFileList.push(group);
            }
            group = {
                files: [file],
                splitName: file.mapName,
                sumTick: file.playbackTicks
            };
        } else {
            group.files.push(file);
            group.sumTick += file.playbackTicks;
        }
    });
    if(group){
        groupedFileList.push(group);
    }
    // element in groupedFileList: {files, sumTime, sumTick}
    return groupedFileList
}
const groupFilesToSplits = (fileList) => {
    // Judge is there SAR splits info. 
    const sarSplits = fileList[fileList.length-1].sarSplits;
    if(sarSplits === undefined || sarSplits === null){
        console.log('[-] No speedrun time found.');
        return groupFilesToSplits_Naive(fileList);
    }
    console.log('[+] Found speedrun time');
    if(sarSplits.reduce((total, item) => total + (item.nsegs || 0), 0) != fileList.length){
        console.error("The total splits of sarsplits are not equal to demo file count. it's dangerous to continue the SAR split. revert to naive one.");
        return groupFilesToSplits_Naive(fileList);
    }

    // element in groupedFileList: {files, sumTime, sumTick}
    const groupedFileList = [];
    let groupIndex = 0;
    let fileIndex = 0;
    while(fileIndex < fileList.length){
        const group = {files:[], sumTime:0, sumTick: 0};
        let segIndex = 0;
        while(segIndex < sarSplits[groupIndex].nsegs){
            group.files.push(fileList[fileIndex]);
            group.sumTick += sarSplits[groupIndex].segs[segIndex].ticks;
            segIndex += 1;
            fileIndex += 1;
        }
        groupedFileList.push(group);
        groupIndex += 1;
    }
    return groupedFileList;
}

// 处理拖放文件
dropZone.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    if(autoClearCheckbox.checked){
        fileGroupedByFolder = {};
    }

    const items = event.dataTransfer.items;
    const tasks = [];
    for (const item of items){
        if (item.kind === "file"){
            // const entry = await item.getAsFileSystemHandle(); //bad compatibility so no.
            const entry = item.webkitGetAsEntry();
            if (entry.isDirectory){
                tasks.push(handleDirectoryEntry(entry, entry.name + "/"));
            } else if (entry.isFile){
                tasks.push(handleFileEntry(entry, "/"));
            }
        }
    }
    await Promise.all(tasks);

    clearTable();
    addTableTitleRow(["Please wait while the demos are parsing..."]);
    if (Object.keys(fileGroupedByFolder).length===0){
        addTableTitleRow(["No demo file founded. Please drag something else or try again."]);
    }
    const sumPlaybackTime = (groupedFileList) => {
        const sumTick = groupedFileList.reduce((total, item) => total + (item.sumTick || 0), 0);
        return sumTick / 60;
    };
    let isFirstDirectory = true;
    for (const directory in fileGroupedByFolder){
        const fileList = fileGroupedByFolder[directory];
        sortFiles(fileList);
        await parseListFiles(fileList);
        await getSARSplitsInfo(fileList);
        const groupedFileList = groupFilesToSplits(fileList);
        if(isFirstDirectory){
            clearTable();isFirstDirectory = false;
        }
        addTableColumn(
            [
                directory, 
                fileList[0]?.player??"unknown", 
                fileList[0]?.file.name.match(/_(.*?)\.dem/)?.[1] || "not matched.",
                formatTime(sumPlaybackTime(groupedFileList)),
                (fileList[fileList.length-1].sarSplits!==null || fileList[fileList-1].sarSplits!==undefined) && fileList[fileList.length-1].sarSplits?.reduce((total, item) => total + (item.nsegs || 0), 0) === fileList.length
            ],
            groupedFileList
        );
    }
});
// 处理排序按钮点击
clearButton.addEventListener("click", () => {
    fileGroupedByFolder = {};
    clearTable();
});
// 复制
copyButton.addEventListener("click", () => {
    const range = document.createRange();
    range.selectNode(document.getElementById("file-table"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    showToast("Table copied to clipboard!");
});
const updateDemoDisplay = () => {
    if(hideDemosCheckbox.checked){
        document.documentElement.style.setProperty('--display-demos', "none");
    }
    else{
        document.documentElement.style.setProperty('--display-demos', "table-row");
    }
};
updateDemoDisplay();
hideDemosCheckbox.addEventListener('change', (e) => {
    updateDemoDisplay();
});
//initial: set hide formatted time.
const updateTimeDisplay = () => {
    if(formatTimeCheckbox.checked){
        document.documentElement.style.setProperty('--display-formatted-time',"");
        document.documentElement.style.setProperty('--display-simple-time',"none");
    }
    else{
        document.documentElement.style.setProperty('--display-formatted-time',"none");
        document.documentElement.style.setProperty('--display-simple-time',"");
    }
};
updateTimeDisplay();
formatTimeCheckbox.addEventListener('change', (e) => {
    updateTimeDisplay();
});
// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});


// Folder drag-and-drop support
async function handleDirectoryEntry(entry, rootPath) {
    const reader = entry.createReader();
    const readEntries = async () => {
        return new Promise((resolve, reject) => {
            reader.readEntries((entries) => {
                if (entries) resolve(entries);
                else reject(new Error("Failed to read entries"));
            });
        });
    };
    let entries = await readEntries();
    let tasks = [];
    for (const subEntry of entries) {
        if (subEntry.isFile) {
            tasks.push(handleFileEntry(subEntry, rootPath));
        } else if (subEntry.isDirectory) {
            tasks.push(handleDirectoryEntry(subEntry, rootPath + subEntry.name + "/")); // 递归调用，传递根目录名
        }
    }
    await Promise.all(tasks);
}

async function handleFileEntry(entry, rootPath){
    const processFile = (file, path) => {
        if (!file.name.endsWith(".dem") && !file.name.endsWith(".DEM")){console.log(`${file.name} not end with .dem, skipped.`);return;}
        if (!fileGroupedByFolder[path]) {
            fileGroupedByFolder[path] = [];
        }
        fileGroupedByFolder[path].push({
            file: file,
            sarSplits: undefined,
            mapName: undefined,
            playbackTicks: undefined,
            player: undefined,
            parsed: false
        });
    }
    return new Promise( (resolve, reject) => {
        entry.file(
            (file)=>{processFile(file,rootPath);resolve();},
            (error)=>{reject(error);});
    });
}

// Util
const formatTime = (time) => {
    let sec = Math.floor(time);
    const ms = Math.ceil((time - sec) * 1000000)
            .toString()
            .padStart(6, "0")
            .slice(0, 3);

    if (sec >= 60) {
        let min = sec / 60;
        sec = sec % 60;
        if (min >= 60) {
            let hrs = min / 60;
            min = Math.floor(min % 60);
            return `${Math.floor(hrs)}:${min.toString().padStart(2, "0")}:${
                sec.toString().padStart(2, "0")
            }.${ms}`;
        }
        return `${Math.floor(min)}:${sec.toString().padStart(2, "0")}.${ms}`;
    }
    return `${Math.floor(sec)}.${ms}`;
};
const toast = document.getElementById("toast");
let isToastVisible = false;
let lastClickTime = 0;
const showToast = (message) =>{
    const currentTime = Date.now();
    if ( currentTime - lastClickTime < 1000 || isToastVisible ){
        return;
    }
    lastClickTime = currentTime;
    toast.textContent = message;
    toast.classList.add("show");
    isToastVisible = true;
    setTimeout(() => {
        toast.classList.remove("show");
        isToastVisible = false;
    }, 1500);
};

const mapNameMapping = {
    "sp_a1_intro1": "Container Ride",
    "sp_a1_intro2": "Portal Carousel",
    "sp_a1_intro3": "Portal Gun",
    "sp_a1_intro4": "Smooth Jazz",
    "sp_a1_intro5": "Cube Momentum",
    "sp_a1_intro6": "Future Starter",
    "sp_a1_intro7": "Secret Panel",
    "sp_a1_wakeup": "Wakeup",
    "sp_a2_intro": "Incinerator",
    "sp_a2_laser_intro": "Laser Intro",
    "sp_a2_laser_stairs": "Laser Stairs",
    "sp_a2_dual_lasers": "Dual Lasers",
    "sp_a2_laser_over_goo": "Laser Over Goo",
    "sp_a2_catapult_intro": "Catapult Intro",
    "sp_a2_trust_fling": "Trust Fling",
    "sp_a2_pit_flings": "Pit Flings",
    "sp_a2_fizzler_intro": "Fizzler Intro",
    "sp_a2_sphere_peek": "Ceiling Catapult",
    "sp_a2_ricochet": "Ricochet",
    "sp_a2_bridge_intro": "Bridge Intro",
    "sp_a2_bridge_the_gap": "Bridge The Gap",
    "sp_a2_turret_intro": "Turret Intro",
    "sp_a2_laser_relays": "Laser Relays",
    "sp_a2_turret_blocker": "Turret Blocker",
    "sp_a2_laser_vs_turret": "Laser vs Turret",
    "sp_a2_pull_the_rug": "Pull the Rug",
    "sp_a2_column_blocker": "Column Blocker",
    "sp_a2_laser_chaining": "Laser Chaining",
    "sp_a2_triple_laser": "Triple Laser",
    "sp_a2_bts1": "Jailbreak",
    "sp_a2_bts2": "Escape",
    "sp_a2_bts3": "Turret Factory",
    "sp_a2_bts4": "Turret Sabotage",
    "sp_a2_bts5": "Neurotoxin Sabotage",
    "sp_a2_bts6": "Tube Ride",
    "sp_a2_core": "Core",
    "sp_a3_00": "Long Fall",
    "sp_a3_01": "Underground",
    "sp_a3_03": "Cave Johnson",
    "sp_a3_jump_intro": "Repulsion Intro",
    "sp_a3_bomb_flings": "Bomb Flings",
    "sp_a3_crazy_box": "Crazy Box",
    "sp_a3_transition01": "PotatOS",
    "sp_a3_speed_ramp": "Propulsion Intro",
    "sp_a3_speed_flings": "Propulsion Flings",
    "sp_a3_portal_intro": "Conversion Intro",
    "sp_a3_end": "Three Gels",
    "sp_a4_intro": "Test",
    "sp_a4_tb_intro": "Funnel Intro",
    "sp_a4_tb_trust_drop": "Ceiling Button",
    "sp_a4_tb_wall_button": "Wall Button",
    "sp_a4_tb_polarity": "Polarity",
    "sp_a4_tb_catch": "Funnel Catch",
    "sp_a4_stop_the_box": "Stop the Box",
    "sp_a4_laser_catapult": "Laser Catapult",
    "sp_a4_laser_platform": "Laser Platform",
    "sp_a4_speed_tb_catch": "Propulsion Catch",
    "sp_a4_jump_polarity": "Repulsion Polarity",
    "sp_a4_finale1": "Finale 1",
    "sp_a4_finale2": "Finale 2",
    "sp_a4_finale3": "Finale 3",
    "sp_a4_finale4": "Finale 4",
};