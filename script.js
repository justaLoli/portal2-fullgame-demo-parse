import {
        DemoMessages,
        SourceDemoParser,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/mod.js";
import {
    SarTimer,
    SourceTimer,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/speedrun/mod.js";

// Util
const formatTime = (time) => {
    let sec = Math.floor(time);
    const ms = Math.round((time - sec) * 1000).toString().padStart(3,"0");
        // .toString()
        // .padStart(6, "0")
        // .slice(0, 3);

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

const dropZone = document.getElementById("drop-zone");
const testButton = document.getElementById("btn");
const fileTableBody = document.querySelector("#file-table tbody");
const fileTableHead = document.querySelector("#file-table thead");
// 存储文件数据
// {file:demo, mapName: undefined, playbackTime:undefined, playbackTicks:undefined, parsed:False}
const fileList = [];

const groupedFileList = [];


// 排序文件列表，按数字顺序排序
const sortFiles = () => {
    fileList.sort((a, b) => {
        console.log(a);
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
const createTableTitle = (titles) => {
    const headerRow = document.createElement("tr");
    titles.forEach( title => {
        const headerCell = document.createElement("th");
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });
    fileTableHead.appendChild(headerRow);
};
// 更新表格显示
const updateTable = () => {
    clearTable(); // 清空表格
    createTableTitle(["Split Name", "Split Time (Seconds)", "Demo Files"])
    groupedFileList.forEach( group => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = group.splitName;
        const timeCell = document.createElement("td");
        timeCell.textContent = (Math.round(group.sumTick / 60 * 1000) / 1000).toString();
        const demosCell = document.createElement("td");
        demosCell.innerHTML = group.files.map(file => file.file.name).join("<br>");
        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(demosCell);
        fileTableBody.appendChild(row);
    } );
    // createTableTitle(["File Name", "Map Name", "Playback Time", "Playback Time (Seconds)", "Playback Ticks"]);
    // fileList.forEach( file => {
    //     const row = document.createElement("tr");
    //     const nameCell = document.createElement("td");
    //     nameCell.textContent = file.file.name;
    //     const mapCell = document.createElement("td");
    //     mapCell.textContent = file.mapName;
    //     const timeCell = document.createElement("td");
    //     timeCell.textContent = formatTime(file.playbackTime);
    //     const timesecCell = document.createElement("td");
    //     timesecCell.textContent = file.playbackTime.toString();
    //     const tickCell = document.createElement("td");
    //     tickCell.textContent = file.playbackTicks.toString();
    //     row.appendChild(nameCell);
    //     row.appendChild(mapCell);
    //     row.appendChild(timeCell);
    //     row.appendChild(timesecCell);
    //     row.appendChild(tickCell);
    //     fileTableBody.appendChild(row);
    // });
};

const parser = SourceDemoParser.default();
const speedrunTimer = SourceTimer.default();
const sarTimer = SarTimer.default();
const tryParseDemo = (ev, fullAdjustment = true) => {
    let demo = null;
    try {
        demo = parser.parse(ev.target.result);
        // should not important
        // demo.fileInfo = ev.target.source;

        // Fix message ticks
        demo.detectGame().adjustTicks();

        // Split screen index
        // should not important
        // slots = demo.messages.find((msg) => msg.slot === 1) ? 2 : 1;

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
const parseListFiles = ()=>{
    return new Promise((resolve)=>{
        let count=0;

        for (const file of fileList) {
            if(file.parsed){
                ++count;
                continue;
            }
            const reader = new FileReader();
            reader.onload = (ev)=>{
                const demo = tryParseDemo(ev);
                if(demo != null){
                    file.mapName = demo.mapName ?? "unknown";
                    file.playbackTime = demo.playbackTime ?? 0;
                    file.playbackTime = Math.round(file.playbackTime * 1000) / 1000;
                    file.playbackTicks = demo.playbackTicks ?? 0;
                    file.parsed = true;
                }

                if(++count === fileList.length){
                    // tuneDemoTime();
                    resolve();
                }

            };
            reader.readAsArrayBuffer(file.file);
        }
    });
};
//this is bad and will not add to correct time :( so forget about it
const tuneDemoTime = ()=>{
    let sar_speedrun_offset = 18980;
    fileList[0].playbackTicks += sar_speedrun_offset;
    fileList[0].playbackTime = fileList[0].playbackTicks / 60;
    fileList[0].playbackTime = Math.round(fileList[0].playbackTime * 1000) / 1000;
    const tube_ride = fileList.find(
        (element) => element.mapName === "sp_a2_bts6"
    );
    if(tube_ride){tube_ride.playbackTime = 51.867;tube_ride.playbackTicks = 3112;}
    const long_fall = fileList.find(
        (element) => element.mapName === "sp_a3_00"
    );
    if(long_fall){long_fall.playbackTime = 77.767;long_fall.playbackTicks = 4666;}
};
const groupFiles = ()=>{
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
    console.log(groupedFileList);
}

// 处理拖放文件
dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    const files = Array.from(event.dataTransfer.files);
    const updatedFiles = files.map(demo => {
        return {
            file: demo,
            mapName: undefined,
            playbackTime: undefined,
            playbackTicks: undefined,
            parsed: false
        };
    });
    fileList.push(...updatedFiles);
    sortFiles();
    clearTable();
    createTableTitle(["Please wait while the demos are parsing..."]);
    parseListFiles().then(()=>{
        groupFiles();
        updateTable(); // 更新表格显示
        console.log(fileList);
        const sumPlaybackTime = () => {
            return fileList.reduce((total, item) => total + (item.playbackTime || 0), 0);
        };
        console.log(sumPlaybackTime());
        console.log(formatTime(sumPlaybackTime()));
    });
    // debugger;
});
// 处理排序按钮点击
testButton.addEventListener("click", () => {
    fileList.length=0;
    groupedFileList.length = 0;
    clearTable();
});
// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});
