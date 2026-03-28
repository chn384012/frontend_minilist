// 1.DOM 요소 취득 (querySelector 사용)
const itemInput = document.querySelector("#itemInput");
const addButton = document.querySelector("#addButton");
const itemList = document.querySelector("#itemList");

// 2.입력값 취득 함수 (동사+명사 형태)
// 입력값을 가져오고 trim()으로 양끝 공백을 제거
function getInputValue() {
  return itemInput.value.trim();
}

// 3.리스트 아이템 생성 함수 (createElement, textContent, appendChild 사용)
function createListItem(text) {
  const li = document.createElement("li");
  li.className = "list-item";

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn";

  // li 하위에 span(텍스트)과 삭제 버튼 추가
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// 4.아이템 추가 함수
function addItem() {
  const text = getInputValue();

  // 공백 입력 방지
  if (text === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  const newListItem = createListItem(text);
  itemList.appendChild(newListItem);

  // 추가 후 input 비우기
  itemInput.value = "";
  itemInput.focus();
}

// 5.리스트 클릭 핸들러 (이벤트 위임 적용)
function handleListClick(event) {
  const target = event.target;
  const li = target.closest("li");

  if (!li) return; // li 외부 클릭 시 무시

  // 삭제 버튼을 클릭한 경우
  if (target.classList.contains("delete-btn")) {
    li.remove();
  }
  // 리스트 텍스트나 여백을 클릭한 경우 (상태 변경)
  else {
    li.classList.toggle("done");
  }
}

// 6.이벤트 등록
addButton.addEventListener("click", addItem);
itemList.addEventListener("click", handleListClick);

// 엔터 키 입력 시에도 추가되도록 편의 기능
itemInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});
