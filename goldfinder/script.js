const dropZone = document.getElementById("drop-zone");
const copyButton = document.getElementById("copy-btn");
const downloadButton = document.getElementById('download-btn');
const downloadFullButton = document.getElementById('download-full-btn');
const progressText = document.getElementById("progress-text");
const outputText = document.getElementById("output");
const searchForm = document.getElementById('search-form');

let fileGroupedByFolder = {};

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

    // Start the process
    const total = Object.keys(fileGroupedByFolder).length;
    let done = 0;
    const MAX_WORKERS = navigator.hardwareConcurrency || 4;
    const workers = [];
    const taskQueue = [];
    let activateWorkers = 0;

    for (let i = 0; i < MAX_WORKERS; i++){
        const worker = new Worker("worker.js", {type: "module"});
        worker.idle = true;
        worker.onmessage = (event) => {
            const { directory, result } = event.data;
            fileGroupedByFolder[directory] = result;
            activateWorkers--;
            done++;
            worker.idle = true;
            processNextTask();
        };
        worker.onerror = (event) => {
            console.error("work error: ", event);
            activateWorkers--;
            worker.idle = true;
            done++;
            processNextTask();
        };

        workers.push(worker);
    }

    const addTask = (directory, fileList) =>{
        taskQueue.push({ directory, fileList });
        processNextTask();
    }

    const processNextTask = () => {
        if(done == total){
            progressText.innerText = "parsing done.";
            output.value = JSON.stringify(fileGroupedByFolder, null, 2); 
        }
        if (activateWorkers >= MAX_WORKERS || taskQueue.length === 0) return;
        const { directory, fileList } = taskQueue.shift();
        const availableWorker = workers.find(w => w.idle);

        if(availableWorker){
            availableWorker.idle = false;
            activateWorkers++;
            progressText.innerText = `parsing ${done} / ${total} ...`;
            availableWorker.postMessage({ directory, fileList });
        }
    }

    for (const directory in fileGroupedByFolder){
        addTask(directory, fileGroupedByFolder[directory]);
    }

});
// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

// Filter
searchForm.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const mapName = document.getElementById('map-name').value;
    const minTime = parseFloat(document.getElementById('min-time').value);
    const maxTime = parseFloat(document.getElementById('max-time').value);

    const minTicks = (minTime * 60) - 1;
    const maxTicks = (maxTime * 60) + 1

    const filteredData = {};

    for (const folder in fileGroupedByFolder) {
        if (fileGroupedByFolder.hasOwnProperty(folder)) {
            const folderData = fileGroupedByFolder[folder];
            for (const map in folderData) {
                if (folderData.hasOwnProperty(map) && map === mapName) {
                    const mapData = folderData[map];
                    if (mapData.sumTick >= minTicks && mapData.sumTick <= maxTicks) {
                        if (!filteredData[folder]) {
                            filteredData[folder] = {};
                        }
                        filteredData[folder][map] = mapData;
                    }
                }
            }
        }
    }

    outputText.value = JSON.stringify(filteredData, null, 2);

});


// copy and download
copyButton.addEventListener("click", (ev) => {
    outputText.select();
    document.execCommand("copy");
    alert('Copied to clipboard!');
});
downloadButton.addEventListener("click", (ev) => {
    downloadJSON(outputText.value, "output.json");
});
downloadFullButton.addEventListener("click", (ev) => {
    const fullJSON = JSON.stringify(fileGroupedByFolder, null, 2);
    downloadJSON(fullJSON, 'full_data.json');
});

// init textarea
window.onload = () => {outputText.value = "";};

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
function downloadJSON(json, filename) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

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