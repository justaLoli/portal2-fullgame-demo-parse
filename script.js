var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SourceDemoParser, } from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/mod.js";
const dropZone = document.getElementById("drop-zone");
const sortButton = document.getElementById("sort-btn");
const fileTableBody = document.querySelector("#file-table tbody");
// 存储文件数据
let fileList = [];
// 排序文件列表，按数字顺序排序
const sortFiles = (files) => {
    return files.sort((a, b) => {
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
// 更新表格显示
const updateTable = () => {
    fileTableBody.innerHTML = ''; // 清空表格
    fileList.forEach(({ file, demoInfo }) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = file.name;
        const mapCell = document.createElement("td");
        mapCell.textContent = demoInfo.mapName;
        const timeCell = document.createElement("td");
        timeCell.textContent = demoInfo.playbackTime.toString();
        const tickCell = document.createElement("td");
        tickCell.textContent = demoInfo.playbackTicks.toString();
        row.appendChild(nameCell);
        row.appendChild(mapCell);
        row.appendChild(timeCell);
        row.appendChild(tickCell);
        fileTableBody.appendChild(row);
    });
};
// 解析文件并提取 mapName
const parseDemoFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const arrayBuffer = yield file.arrayBuffer();
        const demo = SourceDemoParser.default()
            .parse(arrayBuffer);
        // Fix message ticks?
        demo.detectGame().adjustTicks();
        demo.adjustRange();
        let mapName = demo.mapName;
        let playbackTime = demo.playbackTime;
        let playbackTicks = demo.playbackTicks;
        // Adjust time and tick.
        console.log(demo.playbackTime);
        // 返回包含 mapName, playbackTime 和 playbackTicks 的对象
        return {
            mapName: (_a = demo.mapName) !== null && _a !== void 0 ? _a : "Unknown",
            playbackTime: (_b = demo.playbackTime) !== null && _b !== void 0 ? _b : 0, // 假设 playbackTime 存在，若没有提供默认值 0
            playbackTicks: (_c = demo.playbackTicks) !== null && _c !== void 0 ? _c : 0, // 假设 playbackTicks 存在，若没有提供默认值 0
        };
    }
    catch (error) {
        console.error("Error parsing demo file:", file.name, error);
        return {
            mapName: "Error",
            playbackTime: 0,
            playbackTicks: 0,
        };
    }
});
// 处理拖放文件
dropZone.addEventListener("drop", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
        const demoInfo = yield parseDemoFile(file);
        fileList.push({ file, demoInfo });
    }
    fileList = sortFiles(fileList);
    updateTable(); // 更新表格显示
}));
// 处理排序按钮点击
sortButton.addEventListener("click", () => {
    fileList = sortFiles(fileList); // 排序文件列表
    updateTable(); // 更新表格显示
});
// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});
