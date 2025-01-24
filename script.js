import {
        DemoMessages,
        SourceDemoParser,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/mod.js";
import {
    SarTimer,
    SourceTimer,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/speedrun/mod.js";


const dropZone = document.getElementById("drop-zone");
const clearButton = document.getElementById("clear-btn");
const copyButton = document.getElementById("copy-btn");
const autoClearCheckbox = document.getElementById('auto-clear');
const compactModeCheckbox = document.getElementById('hide-demos');
const fileTableBody = document.querySelector("#file-table tbody");
const fileTableHead = document.querySelector("#file-table thead");

let fileGroupedByFolder = {};


// 存储文件数据
// {file:demo, mapName: undefined, playbackTime:undefined, playbackTicks:undefined, parsed:False}
const fileList = [];

const groupedFileList = [];


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
// 更新表格显示
const showFullTable = () => {
    clearTable(); // 清空表格
    addTableTitleRow(["Split Name", "Split Time (Seconds)", "Demo Files"])
    groupedFileList.forEach( group => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = mapNameMapping[group.splitName] || group.splitName;
        const timeCell = document.createElement("td");
        timeCell.textContent = (Math.round(group.sumTime * 1000) / 1000).toFixed(3);
        const demosCell = document.createElement("td");
        demosCell.innerHTML = group.files.map(file => file.file.name).join("\n");
        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(demosCell);
        fileTableBody.appendChild(row);
    } );
}
const showCompactTable = () => {
    clearTable();
    addTableTitleRow([player]);
    groupedFileList.forEach( group => {
        const row1 = document.createElement("tr");
        const timeCell = document.createElement("td");
        timeCell.textContent = (Math.round(group.sumTime * 1000) / 1000).toFixed(3);
        row1.appendChild(timeCell);
        const row2 = document.createElement("tr");
        const demosCell = document.createElement("td");
        demosCell.innerHTML = group.files.map(file => file.file.name).join("<br>");
        row2.appendChild(demosCell);
        fileTableBody.appendChild(row1);
        fileTableBody.appendChild(row2);
    });
}
// const updateTable = () => {
//     if (groupedFileList.length===0){clearTable();return;}
//     if (compactModeCheckbox.checked){
//         showCompactTable();
//     }
//     else{
//         showFullTable();
//     }
// };

const createLeftColumn = () => {
    clearTable();
    ["Folder","Runner","Speedrun Time","Demo Time"].forEach( content=>{
        const row1 = document.createElement("tr");
        const cell1 = document.createElement("th");
        cell1.innerHTML = content;
        row1.appendChild(cell1);
        fileTableHead.appendChild(row1);
    });
    Object.values(mapNameMapping).forEach(mapName=>{
        const row1 = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.innerHTML = mapName;
        row1.appendChild(cell1);
        const row2 = document.createElement("tr");
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
    //addTableTitleRow(title);
    groupedFileList.forEach( (group, index) => {
        const timeCell = document.createElement("td");
        timeCell.textContent = (Math.round(group.sumTime * 1000) / 1000).toFixed(3);
        rows[index * 2]?.appendChild(timeCell);
        const demosCell = document.createElement("td");
        demosCell.innerHTML = group.files.map(file => file.file.name).join("<br>");
        rows[index * 2 + 1]?.appendChild(demosCell);
    });
}


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
                    file.playbackTime = demo.playbackTime ?? 0;
                    // file.playbackTime = Math.round(file.playbackTime * 1000) / 1000;
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
//this is bad and will not add to correct time :( so forget about it
const tuneDemoTime = (fileList)=>{
    let sar_speedrun_demo_offset = 18637; // magic number :)
    const container_ride = fileList.find(
        (element) => element.mapName === "sp_a1_intro1"
    );
    if(container_ride){
        container_ride.playbackTicks += sar_speedrun_demo_offset;
        container_ride.playbackTime = container_ride.playbackTicks / 60;
        container_ride.playbackTime = Math.round(fileList[0].playbackTime * 1000) / 1000;
    }
    const tube_ride = fileList.find(
        (element) => element.mapName === "sp_a2_bts6"
    );
    if(tube_ride){tube_ride.playbackTime = 51.867;tube_ride.playbackTicks = 3112;}
    const long_fall = fileList.find(
        (element) => element.mapName === "sp_a3_00"
    );
    if(long_fall){long_fall.playbackTime = 77.767;long_fall.playbackTicks = 4666;}
};
const groupFilesToSplits = (fileList)=> {
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
                sumTime: file.playbackTime,
                sumTick: file.playbackTicks
            };
        } else {
            group.files.push(file);
            group.sumTime += file.playbackTime;
            group.sumTick += file.playbackTicks;
        }
    });
    if(group){
        groupedFileList.push(group);
    }
    return groupedFileList
}




// 处理拖放文件
dropZone.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    if(autoClearCheckbox.checked){
        fileList.length = 0;
        groupedFileList.length = 0;
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
                tasks.push(handleFileEntry(entry, ""));
            }
        }
    }
    await Promise.all(tasks);
    console.log(fileGroupedByFolder);
    // debugger;

    // const files = Array.from(event.dataTransfer.files);
    // const updatedFiles = files.map(demo => {
    //     return {
    //         file: demo,
    //         mapName: undefined,
    //         playbackTime: undefined,
    //         playbackTicks: undefined,
    //         parsed: false
    //     };
    // });
    // debugger;
    // fileList.push(...updatedFiles);
    // sortFiles();
    clearTable();
    addTableTitleRow(["Please wait while the demos are parsing..."]);
    if (Object.keys(fileGroupedByFolder).length===0){
        addTableTitleRow(["No demo file founded. Please drag something else or try again."]);
    }
    const sumPlaybackTime = (fileList) => {
        return fileList.reduce((total, item) => total + (item.playbackTime || 0), 0);
    };
    let isFirstDirectory = true;
    for (const directory in fileGroupedByFolder){
        const fileList = fileGroupedByFolder[directory];
        sortFiles(fileList);
        await parseListFiles(fileList);
        const groupedFileList = groupFilesToSplits(fileList);
        if(isFirstDirectory){
            clearTable();isFirstDirectory = false;
        }
        addTableColumn(
            [
                directory, 
                fileList[0]?.player??"unknown", 
                fileList[0]?.file.name.match(/_(.*?)\.dem/)?.[1] || "not matched.",
                formatTime(sumPlaybackTime(fileList))
            ],
            groupedFileList
        );
    }
    // parseListFiles().then(()=>{
    //     groupFilesToSplits();
    //     updateTable(); // 更新表格显示
    //     console.log(fileList);
    //     const sumPlaybackTime = () => {
    //         // const ticks = fileList.reduce((total, item) => total + (item.playbackTicks || 0), 0);
    //         return fileList.reduce((total, item) => total + (item.playbackTime || 0), 0);
    //         // return Math.round(ticks/60 *1000)/1000;
    //     };
    //     console.log(sumPlaybackTime());
    //     console.log(formatTime(sumPlaybackTime()));
    // });
    // debugger;
});
// 处理排序按钮点击
clearButton.addEventListener("click", () => {
    fileList.length=0;
    groupedFileList.length = 0;
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
compactModeCheckbox.addEventListener('change', ()=>{updateTable();});
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
            mapName: undefined,
            playbackTime: undefined,
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