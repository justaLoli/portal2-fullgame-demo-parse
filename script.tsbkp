import {
    DemoMessages,
    SourceDemoParser,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/mod.js";
import {
    SarTimer,
    SourceTimer,
} from "https://unpkg.com/@nekz/sdp@0.10.0/esm/src/speedrun/mod.js";

const dropZone = document.getElementById("drop-zone")!;
const sortButton = document.getElementById("sort-btn")!;
const fileTableBody = document.querySelector("#file-table tbody")!;

interface DemoInfo {
  mapName: string;
  playbackTime: number;
  playbackTicks: number;
}

// 存储文件数据
let fileList: { file: File, demoInfo: DemoInfo }[] = [];

// 排序文件列表，按数字顺序排序
const sortFiles = (files: { file: File, demoInfo: DemoInfo }[]) => {
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
  fileTableBody.innerHTML = '';  // 清空表格
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
const parseDemoFile = async (file: File): Promise<DemoInfo> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const demo = SourceDemoParser.default()
      .parse(arrayBuffer);
    // Fix message ticks?
    demo.detectGame().adjustTicks();
    demo.adjustRange();//this one is important :)
    let mapName = demo.mapName;
    let playbackTime = demo.playbackTime;
    let playbackTicks = demo.playbackTicks;
    // Adjust time and tick.
    console.log(demo.playbackTime);

    // 返回包含 mapName, playbackTime 和 playbackTicks 的对象
    return {
      mapName: demo.mapName ?? "Unknown",
      playbackTime: demo.playbackTime ?? 0,  // 假设 playbackTime 存在，若没有提供默认值 0
      playbackTicks: demo.playbackTicks ?? 0,  // 假设 playbackTicks 存在，若没有提供默认值 0
    };
  } catch (error) {
    console.error("Error parsing demo file:", file.name, error);
    return {
      mapName: "Error",
      playbackTime: 0,
      playbackTicks: 0,
    };
  }
};

// 处理拖放文件
dropZone.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");

  const files = Array.from(event.dataTransfer!.files);
  for (const file of files) {
    const demoInfo = await parseDemoFile(file);
    fileList.push({ file, demoInfo });
  }
  fileList = sortFiles(fileList);
  updateTable();  // 更新表格显示
});

// 处理排序按钮点击
sortButton.addEventListener("click", () => {
  fileList = sortFiles(fileList);  // 排序文件列表
  updateTable();  // 更新表格显示
});

// 处理拖拽区的 hover 状态
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
