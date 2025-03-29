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
const copyButton = document.getElementById("copy-btn");
const progressText = document.getElementById("progress-text");
const outputText = document.getElementById("output");

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
                    resolve();
                }

            };
            reader.readAsArrayBuffer(file.file);
        }
    });
};

const groupFilesByMapName = (fileList) => {
    const groupedFiles = {};

    fileList.forEach(file => {
        if (!groupedFiles[file.mapName]) {
            groupedFiles[file.mapName] = {
                files: [],
                sumTick: 0
            };
        }
        const group = groupedFiles[file.mapName];
        group.files.push({
            fileName: file.file.name,
            playbackTicks: file.playbackTicks
        });
        group.sumTick += file.playbackTicks;
    });

    return groupedFiles;
};

// 处理拖放文件
dropZone.addEventListener("drop", async (event) => {
    // routine 
    event.preventDefault();
    dropZone.classList.remove("dragover");
    
    // clear existing files
    fileGroupedByFolder = {};

    // get all files.
    // hint for init
    progressText.innerText = "Getting File Index";
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

    // start showing things.
    progressText.innerText = ""
    // const sumPlaybackTime = (groupedFileList) => {
    //     const sumTick = groupedFileList.reduce((total, item) => total + (item.sumTick || 0), 0);
    //     return sumTick / 60;
    // };
    let i = 0;
    const total = Object.keys(fileGroupedByFolder).length;
    for (const directory in fileGroupedByFolder){
        i ++ ;
        progressText.innerText = `${i} / ${total}`;
        const fileList = fileGroupedByFolder[directory];
        // sortFiles(fileList);
        await parseListFiles(fileList);
        const groupedFilesByMapName = groupFilesByMapName(fileList);
        fileGroupedByFolder[directory] = groupedFilesByMapName;
    }
    progressText.innerText = "done parsing";

    // 递归转换 Map 为普通对象
    function mapToObject(obj) {
        if (obj instanceof Map) {
            return Object.fromEntries([...obj.entries()].map(([key, value]) => [key, mapToObject(value)]));
        } else if (Array.isArray(obj)) {
            return obj.map(mapToObject);
        } else if (typeof obj === "object" && obj !== null) {
            return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, mapToObject(value)]));
        }
        return obj;
    }

    // 转换 fileGroupedByFolder 并显示到 output
    const fileGroupedByFolderObj = mapToObject(fileGroupedByFolder);

    // // 使用 JSONView 显示数据
    // const jsonView = new JSONView();
    // jsonView.showJSON(fileGroupedByFolderObj);
    output.value = JSON.stringify(fileGroupedByFolder, null, 2);


});
// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
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