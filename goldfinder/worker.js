// worker.js
self.addEventListener('message', async (event) => {
  debugger;
  const { directory, fileList } = event.data;
  try{
    await parseListFiles(fileList);
    const groupedFiles = groupFilesByMapName(fileList);
    self.postMessage({ directory:directory, result: groupedFiles });
  } catch (error) {
    self.postMessage({ error });
  }
});

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
const downloadButton = document.getElementById('download-btn');
const downloadFullButton = document.getElementById('download-full-btn');
const progressText = document.getElementById("progress-text");
const outputText = document.getElementById("output");
const searchForm = document.getElementById('search-form');

let fileGroupedByFolder = {};

// 排序文件列表，按数字顺序排序
// not needed, but preserved
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
// copied the logic from https://nekz.me/parser
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