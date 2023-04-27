// Define variables
const goalForm = document.getElementById('goal-form');
const goalInput = document.getElementById('goal');
const targetDateInput = document.getElementById('target-date');
const tableBody = document.querySelector('table tbody');
const chart = new Chart(document.getElementById('chart'), {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'Days Remaining',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
let goals = [];

// Add event listener to form submit
goalForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get goal and target date from form
  const goal = goalInput.value.trim();
  const targetDate = targetDateInput.value.trim();

  // Validate form input
  if (!goal || !targetDate) {
    alert('Please enter a goal and target date.');
    return;
  }

  // Check if the goal already exists
  const existingGoalIndex = goals.findIndex(g => g.goal === goal);
  if (existingGoalIndex > -1) {
    const existingGoal = goals[existingGoalIndex];
    const existingDaysRemaining = existingGoal.daysRemaining;
    const newDaysRemaining = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const daysRemainingDiff = newDaysRemaining - existingDaysRemaining;
    existingGoal.targetDate = targetDate;
    existingGoal.daysRemaining = newDaysRemaining;

    // Update table row
    const row = tableBody.children[existingGoalIndex];
    row.cells[1].textContent = targetDate;
    row.cells[2].textContent = newDaysRemaining;

    // Update chart data
    chart.data.datasets[0].data[existingGoalIndex] += daysRemainingDiff;
    chart.update();
  } else {
    // Create goal object and add to goals array
    const daysRemaining = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
    const goalObj = { goal, targetDate, daysRemaining };
    goals.push(goalObj);

    // Add goal to table
    const row = tableBody.insertRow();
    const goalCell = row.insertCell();
    const targetDateCell = row.insertCell();
    const daysRemainingCell = row.insertCell();
    const editCell = row.insertCell();
    const removeCell = row.insertCell();
    goalCell.textContent = goalObj.goal;
    targetDateCell.textContent = goalObj.targetDate;
    daysRemainingCell.textContent = goalObj.daysRemaining;
    if (daysRemaining!=null){
	alert("the no of days allocated to complete the task "+ goal+" are "+daysRemaining);
}

    // Add edit and remove buttons
    const editButton = document.createElement('button');
    editButton.setAttribute('class','button1');
    editButton.textContent = 'Edit Goal';
    editButton.addEventListener('click', () => {
      goalInput.value = goalObj.goal;
      targetDateInput.value = goalObj.targetDate;
      removeGoal(existingGoalIndex);
    });
    editCell.appendChild(editButton);
    const removeButton = document.createElement('button');
    removeButton.setAttribute('class','button1');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeGoal(existingGoalIndex);
    });
    removeCell.appendChild(removeButton);

    // Update chart data
    chart.data.labels.push(goalObj.goal);
    chart.data.datasets[0].data.push(goalObj.daysRemaining);
    chart.update();
  }

  // Reset form input
  goalInput.value =  targetDateInput.value = '';
});

// Function to remove a goal from the goals array and update the table and chart
function removeGoal(index) {
  // Remove goal from goals array
  goals.splice(index, 1);

  // Remove goal from table
  tableBody.deleteRow(index);

  // Remove goal from chart
  chart.data.labels.splice(index, 1);
  chart.data.datasets[0].data.splice(index, 1);
  chart.update();
}
//speak
const userText = document.getElementById('goal');
const speechBtn = document.getElementById('speech')

speechBtn.addEventListener('click', function () {
    speechText = userText.value;

    let speechData = new SpeechSynthesisUtterance();
    
    speechData.text = speechText;

    speechSynthesis.speak(speechData);
})
// addnot
showNotes();

let addBtn = document.getElementById('addBtno');
addBtn.addEventListener('click', function () {
    let addTxt = document.getElementById('addTxto');
    let notes = localStorage.getItem('notes');

    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }

    notesObj.push(addTxt.value);
    localStorage.setItem('notes', JSON.stringify(notesObj));
    addTxt.value = '';
    showNotes();
});

function showNotes() {
    let notes = localStorage.getItem('notes');
    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }

    let html = "";
    notesObj.forEach(function (element, index) {
        html += `
        <div class="noteCardo">
        <div class="card-bodyo">
          <h5 class="card-titleo">Note ${index + 1}</h5>
          <p class="card-texto">${element}</p>
          <button href="#" class="delete-btno"  id="${index}" onclick="deleteNote(this.id)">Delete Note</button>
        </div>
      </div>`;
    });

    let notesElm = document.getElementById('noteso');
    if (notesObj.length != 0) {
        notesElm.innerHTML = html;
    }
    else {
        notesElm.innerHTML = `No, notes! Click on Add Note Section to add Notes!`;
    }
}

function deleteNote(index) {
    let notes = localStorage.getItem('notes');
    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }
    notesObj.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notesObj));
    showNotes();
}


let search = document.getElementById('searchTxto');
search.addEventListener('input', function () {
    let inputVal = search.value.toLowerCase;

    let noteCards = document.getElementsByClassName('noteCardo');
    Array.from(noteCards).forEach(function (element) {
        let cardTxt = element.getElementsByTagName('p')[0].innerText;
        if (cardTxt.includes(inputVal)) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none";
        }
    });
});

