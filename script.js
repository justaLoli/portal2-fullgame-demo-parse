var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SourceDemoParser } from '@nekz/sdp';
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
    fileList.forEach(({ file, mapName }) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.textContent = file.name;
        const mapCell = document.createElement("td");
        mapCell.textContent = mapName;
        row.appendChild(nameCell);
        row.appendChild(mapCell);
        fileTableBody.appendChild(row);
    });
};
// 解析文件并提取 mapName
const parseDemoFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const arrayBuffer = yield file.arrayBuffer();
        const demo = SourceDemoParser.default()
            .setOptions({ messages: false })
            .parse(arrayBuffer);
        // 检查 mapName 是否为 undefined，若是，返回默认值
        return (_a = demo.mapName) !== null && _a !== void 0 ? _a : "Unknown";
    }
    catch (error) {
        console.error("Error parsing demo file:", file.name, error);
        return "Error";
    }
});
// 处理拖放文件
dropZone.addEventListener("drop", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
        const mapName = yield parseDemoFile(file);
        fileList.push({ file, mapName });
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
