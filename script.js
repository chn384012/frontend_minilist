const itemInput = document.querySelector("#itemInput");
const addButton = document.querySelector("#addButton");
const itemList = document.querySelector("#itemList");
const filterGroup = document.querySelector("#filterGroup");

// 항목 데이터를 관리할 배열과 현재 필터 상태
let todos = [];
let currentFilter = "all";

// 입력값 취득 함수
function getInputValue() {
  return itemInput.value.trim();
}

// 지연을 발생시키는 Promise 함수
function delayRender(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 항목 추가 로직 (async/await 적용)
async function addItem() {
  const text = getInputValue();
  if (text === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  // Promise를 이용한 지연 렌더링 (0.5초 대기)
  // await는 Promise가 끝날 때까지 기다린 뒤 다음 코드를 실행
  await delayRender(500);

  // DOM에 바로 추가하지 않고 배열에 저장
  const newTodo = {
    id: Date.now(), // 고유 식별자
    text: text,
    done: false,
  };
  todos.push(newTodo);

  itemInput.value = "";
  itemInput.focus();

  // 데이터가 변경되었으니 화면을 새로 그림
  renderList();
}

// 필터링 로직 함수
function filterItems() {
  if (currentFilter === "done") {
    return todos.filter((todo) => todo.done === true);
  } else if (currentFilter === "undone") {
    return todos.filter((todo) => todo.done === false);
  }
  return todos; // 'all'일 경우 전체 배열 반환
}

// 리스트 아이템 DOM 생성 함수
function createListItem(todo) {
  const li = document.createElement("li");
  li.className = "list-item";
  // 나중에 클릭 이벤트를 위해 li에 id를 저장
  li.dataset.id = todo.id;

  if (todo.done) {
    li.classList.add("done");
  }

  const span = document.createElement("span");
  span.textContent = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.className = "delete-btn";

  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

// 화면 렌더링 함수
function renderList() {
  // innerHTML을 쓰지 않고 안전하게 기존 목록 비우기
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // 현재 필터 조건에 맞는 배열만 가져오기
  const filteredTodos = filterItems();

  // 필터링된 배열을 순회하며 화면에 그리기
  filteredTodos.forEach((todo) => {
    const li = createListItem(todo);
    itemList.appendChild(li);
  });
}

// 리스트 클릭 이벤트 핸들러 (이벤트 위임)
function handleListClick(event) {
  const target = event.target;
  const li = target.closest("li");
  if (!li) return;

  // 문자열로 저장된 dataset.id를 숫자로 변환
  const todoId = Number(li.dataset.id);

  if (target.classList.contains("delete-btn")) {
    // 배열에서 해당 id를 가진 항목을 제외(filter)하여 삭제 효과 구현
    todos = todos.filter((todo) => todo.id !== todoId);
  } else {
    // 클릭한 항목의 상태(done)를 반전시킴
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex !== -1) {
      todos[todoIndex].done = !todos[todoIndex].done;
    }
  }

  // 데이터가 변경되었으므로 화면 다시 그리기
  renderList();
}

// 필터 버튼 클릭 이벤트 핸들러 (이벤트 위임)
function handleFilterClick(event) {
  const target = event.target;
  if (!target.classList.contains("filter-btn")) return;

  // 현재 선택된 필터 업데이트
  currentFilter = target.dataset.filter;

  // 버튼 활성화 스타일 변경
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  target.classList.add("active");

  // 필터가 변경되었으므로 화면 다시 그리기
  renderList();
}

// 이벤트 등록
addButton.addEventListener("click", addItem);
itemList.addEventListener("click", handleListClick);
filterGroup.addEventListener("click", handleFilterClick);

itemInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addItem();
});
