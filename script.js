"use strict";

window.addEventListener("DOMContentLoaded", start);

//create array for all the students
let allStudents = [];
let students = [];
let expelledData = [];

//global constants and variables
const selector = document.querySelector("#houses"); //housefiltration
const search = document.querySelector("#search"); //searchbar

//create prototype
let Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  gender: "",
  house: "",
  bloodstatus: "tba",
  inqsquad: false,
  prefect: false,
  expelled: false,
};

//initialize program
function start() {
  loadJSON();
  addEventlisteners();
}

//load JSON
function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      cleanData(jsonData);
    });
}

///////CLEAN THE DATA///////

//clean JSON-data
function cleanData(jsonData) {
  jsonData.forEach((jsonObject) => {
    let student = Object.create(Student);
    student = separate(student, jsonObject);
    student = capitalize(student);
    student = getImage(student);

    allStudents.unshift(student);
  });

  buildList();
}
//separates the data
function separate(student, jsonObject) {
  const firstSpace = jsonObject.fullname.trim().indexOf(" ");
  const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");
  const firstQuoatation = jsonObject.fullname.trim().indexOf(`"`);
  const lastQuoatation = jsonObject.fullname.trim().lastIndexOf(`"`);

  student.firstName = jsonObject.fullname.trim().substring(0, firstSpace);
  student.middleName = jsonObject.fullname.substring(firstSpace, lastSpace);
  student.nickName = jsonObject.fullname.substring(firstQuoatation, lastQuoatation);
  student.lastName = jsonObject.fullname.trim().substring(lastSpace).trim();

  student.house = jsonObject.house.trim().substring(0, jsonObject.house.length).trim();
  student.gender = jsonObject.gender.trim().substring(0, jsonObject.gender.length).trim();

  return student;
}
//capitalizes the data
function capitalize(student) {
  //capitalize firstname
  student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1, student.firstName.length).toLowerCase();

  //capitalize middlename
  student.middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1, student.middleName.length).toLowerCase();

  //capitalize nickname
  student.nickName = student.nickName.substring(0, 1).toUpperCase() + student.nickName.substring(1, student.nickName.length).toLowerCase();

  //capitalize lastname
  student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1, student.lastName.length).toLowerCase();

  //capitalize gender
  student.gender = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1, student.gender.length).toLowerCase();

  //capitalize house
  student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1, student.house.length).toLowerCase();

  student.fullname = student.firstName + " " + student.nickName + " " + student.middleName + " " + student.lastName;

  return student;
}
//return the string for src
function getImage(student) {
  student.image = `/images/${student.lastName}_${student.firstName.charAt(0)}.png`;

  return student;
}

//add eventlisteners
function addEventlisteners() {
  //listens on dropdown
  selector.addEventListener("change", selectedFilter);

  //listen on sort
  document.querySelectorAll(".filterbutton").forEach((button) => {
    button.addEventListener("click", sorter);
  });

  //listen on student functionalities buttons

  search.addEventListener("input", searchForStudent);
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

//display the original list
function displayList(students) {
  // clear the list
  document.querySelector("main").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

//display students on the list
function displayStudent(student) {
  // create clone
  const klon = document.querySelector("template").content.cloneNode(true);
  klon.querySelector("li").addEventListener("click", () => displayPopUp(student));

  // set clone data
  klon.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  klon.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  klon.querySelector("[data-field=house]").innerHTML = student.house;

  // append clone to list
  document.querySelector("main").appendChild(klon);
}

//display popup with details of student
function displayPopUp(student) {
  console.log(student);
  const popup = document.querySelector("#popup");
  popup.classList.remove("hidden");
  popup.classList.add("popupstyle");

  popup.querySelector("#image").src = student.image;
  popup.querySelector(".firstname").textContent = "First name: " + student.firstName;
  popup.querySelector(".lastname").textContent = "First name: " + student.lastName;
  popup.querySelector(".middlename").textContent = "Middle name: " + student.middleName;
  popup.querySelector(".nickname").textContent = "Last name: " + student.nickName;
  popup.querySelector(".gender").textContent = "Gender: " + student.gender;
  popup.querySelector(".house").textContent = "House: " + student.house;
  popup.querySelector(".bloodstatus").textContent = "Bloodstatus: " + student.bloodstatus;
  popup.querySelector(".prefect").textContent = "Prefect: " + student.prefect;
  if (student.house === "Slytherin" && student.expelled === false) {
    popup.querySelector(".inqsquad").textContent = "Part of Inq. Squad: " + student.inqsquad;
  } else {
    popup.querySelector("#inqSquad_button").classList.add("hidden");
  }

  if (student.prefect === false) {
    document.querySelector("#prefect_button").textContent = "Add student prefect";
    document.querySelector("#prefecticon").classList.add("hidden");
  } else {
    document.querySelector("#prefect_button").textContent = "Remove student prefect";
    document.querySelector("#prefecticon").classList.remove("hidden");
  }

  popup.querySelector(".crest").src = `images/${student.house.toLowerCase()}_crest.png`;
  if (student.house === "Gryffindor") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #61210f 0%, #ee6c4d 74%)";
  } else if (student.house === "Slytherin") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #63d471 0%, #233329 74%)";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #36096d 0%, #37d5d6 74%)";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #fbb034 0%, #ffdd00 74%)";
  }

  //expell
  if (student.expelled === true) {
    popup.querySelector(".expelled").textContent = "STUDENT IS EXPELLED";
    popup.querySelector("#inqSquad_button").classList.add("hidden");
    popup.querySelector("#prefect_button").classList.add("hidden");
    popup.querySelector("#expell_button").classList.add("hidden");
  } else if (student.expelled === false) {
    popup.querySelector("#expell_button").classList.remove("hidden");
    popup.querySelector("#prefect_button").classList.remove("hidden");
    popup.querySelector(".expelled").textContent = "";
    popup.querySelector("#expell_button").textContent = `Expell ${student.firstName}`;
  }
  document.querySelector("#expell_button").addEventListener("click", expellStudentClosure);
  function expellStudentClosure() {
    document.querySelector("#expell_button").removeEventListener("click", expellStudentClosure);
    expellStudent(student);
    removePopUp();
  }

  //prefect
  document.querySelector("#prefect_button").addEventListener("click", addPrefectClosure);
  function addPrefectClosure() {
    document.querySelector("#prefect_button").removeEventListener("click", addPrefectClosure);
    addPrefect(student);
  }

  popup.querySelector("#close_popup").addEventListener("click", removePopUp);
}

//remove the popup - maybe make as closure function
function removePopUp() {
  document.querySelector("#popup").classList.add("hidden");
  document.querySelector("#popup").classList.remove("popupstyle");
}

///////STUDENT FUNCTIONS///////
//expell a student
function expellStudent(student) {
  student.expelled = !student.expelled;
  allStudents.splice(allStudents.indexOf(student), 1);
  expelledData.push(student);
  removePopUp();
  buildList();
}

//add prefect to student
function addPrefect(student) {
  const sameGenderAndHouse = allStudents.filter(checkGenderAndHouse);
  if (student.prefect === true) {
    student.prefect = !student.prefect;

    console.log(student);
  } else if (sameGenderAndHouse.length >= 1) {
    prefectConflict(sameGenderAndHouse, student);
    console.log(sameGenderAndHouse);
  } else if (student.prefect === false) {
    student.prefect = !student.prefect;

    console.log(student);
  }

  function checkGenderAndHouse(compareStudent) {
    if (student.house === compareStudent.house && student.gender === compareStudent.gender && compareStudent.prefect == true) {
      return true;
    } else {
      return false;
    }
  }
  displayPopUp(student);
  buildList(student);
}

//starter kun hvis der er konflikt
function prefectConflict(sameGenderAndHouse, student) {
  document.querySelector("#prefectConflict").classList.add("show");
  document.querySelector(".closebutton_dialog").addEventListener("click", removeDialog);
  document.querySelector("#prefectConflict .student").textContent = `${sameGenderAndHouse[0].firstName} ${sameGenderAndHouse[0].lastName}`;
  document.querySelector("#prefectConflict [data-action=remove]").addEventListener("click", function () {
    togglePrefect(student);
  });
  function togglePrefect(student) {
    document.querySelector("#prefectConflict [data-action=remove]").removeEventListener("click", function () {
      togglePrefect(student);
    });
    document.querySelector("#prefectConflict").classList.remove("show");
    console.log(student);
    student.prefect = !student.prefect;
  }

  function removeDialog() {
    document.querySelector("#prefectConflict").classList.remove("show");
    document.querySelector(".closebutton_dialog").removeEventListener("click", removeDialog);
    displayPopUp(student);
  }
  buildList();
}

///////FILTERS///////
//determine which filter is in use
function selectedFilter() {
  const filter = this.value;
  houseFiltration(filter);
}
function houseFiltration() {
  students = allStudents;

  if (selector.value === "all") {
    displayList(allStudents);
  } else if (selector.value === "slytherin") {
    students = allStudents.filter(isSlytherin);
  } else if (selector.value === "ravenclaw") {
    students = allStudents.filter(isRavenclaw);
  } else if (selector.value === "hufflepuff") {
    students = allStudents.filter(isHufflepuff);
  } else if (selector.value === "gryffindor") {
    students = allStudents.filter(isGryffindor);
  } else if (selector.value === "expelled") {
    students = expelledData;
    console.log(students);
    displayList(expelledData);
  }

  displayList(students);
}
//gryffindor-filter
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
//slytherin-filter
function isSlytherin(student) {
  return student.house === "Slytherin";
}
//ravenclaw-filter
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
//hufflepuff-filter
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

///////SORTING///////

//determine which sorter to use
function sorter(students) {
  students = allStudents;
  let sorter = this.dataset.filter;
  if (sorter === "filterFirstNameAtoZ") {
    students.sort(sortFirstName);
  } else if (sorter === "filterLastNameAtoZ") {
    students.sort(sortLastName);
  }
  buildList();
}
//sort by first name
function sortFirstName(a, b) {
  if (a.firstName < b.firstName) {
    return -1;
  } else {
    return 1;
  }
}
//sort by last name
function sortLastName(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  } else {
    return 1;
  }
}

///////SEARCH///////
//search function
function searchForStudent(input) {
  console.log(input.target.value);
  let searchList = students.filter((student) => student.fullname.toLowerCase().includes(input.target.value));
  displayList(searchList);
}
