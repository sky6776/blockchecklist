document.addEventListener("DOMContentLoaded", function() {
  const checklist = document.getElementById("checklist");
  const showUncheckedBtn = document.getElementById("showUncheckedBtn");
  const showAllBtn = document.getElementById("showAllBtn");
  const separateSelect = document.getElementById("separateSelect");

  let itemsPerPage = 27;

  function loadChecklist() {
    fetch("items.txt")
      .then(response => response.text())
      .then(data => {
        const items = data.split("\n");
        let count = 0;
        let separatorCount = 1;
        let itemNumber = 1;
        items.forEach((item, index) => {
          if (index !== 0 && index % itemsPerPage === 0) {
            addSeparator(separatorCount);
            separatorCount++;
            itemNumber = 1;
          }
          const li = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          li.appendChild(checkbox);
          const span = document.createElement("span");
          span.textContent = itemNumber;
          li.appendChild(span);
          itemNumber++;
          li.appendChild(document.createTextNode(item.trim()));
          checklist.appendChild(li);
          count++;
        });
        addSeparator(separatorCount);
        restoreCheckedItems();
      });
  }

  function addSeparator(separatorNumber) {
    const separator = document.createElement("hr");
    const span = document.createElement("span");
    span.textContent = separatorNumber;
    separator.appendChild(span);
    checklist.appendChild(separator);
  }

  function showUncheckedItems() {
    const items = checklist.querySelectorAll("li");
    items.forEach(item => {
      const checkbox = item.querySelector("input[type=checkbox]");
      if (!checkbox.checked) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  function showAllItems() {
    const items = checklist.querySelectorAll("li");
    items.forEach(item => {
      item.style.display = "block";
    });
  }

  function saveCheckedItems() {
    const items = checklist.querySelectorAll("li");
    const checkedItems = [];
    items.forEach(item => {
      const checkbox = item.querySelector("input[type=checkbox]");
      if (checkbox.checked) {
        checkedItems.push(item.textContent.trim());
      }
    });
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
  }

  function restoreCheckedItems() {
    const storedItems = JSON.parse(localStorage.getItem("checkedItems"));
    if (storedItems) {
      const items = checklist.querySelectorAll("li");
      items.forEach(item => {
        const text = item.textContent.trim();
        if (storedItems.includes(text)) {
          const checkbox = item.querySelector("input[type=checkbox]");
          checkbox.checked = true;
          item.classList.add("checked");
        }
      });
    }
  }

  loadChecklist();

  showUncheckedBtn.addEventListener("click", function() {
    showUncheckedItems();
  });

  showAllBtn.addEventListener("click", function() {
    showAllItems();
  });

  separateSelect.addEventListener("change", function(event) {
    itemsPerPage = parseInt(event.target.value);
    checklist.innerHTML = "";
    loadChecklist();
  });

  function toggleCheckedState(checkbox) {
    const listItem = checkbox.parentNode;
    listItem.classList.toggle("checked");
    saveCheckedItems();
  }

  checklist.addEventListener("click", function(event) {
    if (event.target.tagName === "INPUT" && event.target.type === "checkbox") {
      toggleCheckedState(event.target);
    }
  });
});
