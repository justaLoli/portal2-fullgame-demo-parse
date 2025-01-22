const dropZone = document.getElementById("drop-zone")!;
const sortButton = document.getElementById("sort-btn")!;
const fileTableBody = document.querySelector("#file-table tbody")!;

// 存储文件数据
let fileList: File[] = [];

// 排序文件列表，按数字顺序排序
const sortFiles = (files: File[]) => {
  return files.sort((a, b) => {
    const matchA = a.name.match(/_(\d+)\.dem$/);
    const matchB = b.name.match(/_(\d+)\.dem$/);

    if (matchA && matchB) {
      return parseInt(matchA[1]) - parseInt(matchB[1]);
    }
    
    if (!matchA && matchB) {
      return -1;
    }
    if (matchA && !matchB) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
};

// 更新表格显示
const updateTable = () => {
  fileTableBody.innerHTML = '';  // 清空表格
  fileList.forEach((file) => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = file.name;
    row.appendChild(cell);
    fileTableBody.appendChild(row);
  });
};

// 处理拖放文件
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragover");

  const files = Array.from(event.dataTransfer!.files);
  fileList = [...fileList, ...files];  // 将新文件加入到已有文件列表
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
