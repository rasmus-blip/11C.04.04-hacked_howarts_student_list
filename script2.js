"use strict";

window.addEventListener("DOMContentLoaded", start);

const selector = document.querySelector("#houses"); //housefiltration

let allStudents = [];

let expelledData = [];

let filteredList = [];

let prefectsGryffindor = [];
let prefectsSlytherin = [];
let prefectsRavenclaw = [];
let prefectsHufflepuff = [];

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

function start() {
  loadJSON();
  addEventlisteners();
}

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      cleanData(jsonData);
    });
}

function addEventlisteners() {
  selector.addEventListener("change", selectedFilter);

  //listen on sort
  document.querySelectorAll("#sort button").forEach((button) => {
    button.addEventListener("click", sorter);
  });

  //listen on student functionalities buttons

  search.addEventListener("input", searchForStudent);
}

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

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

function displayList(students) {
  // clear the list
  document.querySelector("main").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

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

function displayPopUp(student) {
  const popup = document.querySelector("#popup");
  popup.classList.remove("hidden");
  popup.classList.add("popupstyle");

  //remove eventlisteners on buttons
  popup.querySelector("#close_popup").addEventListener("click", () => {
    popup.classList.add("hidden");
    document.querySelector("#prefect_button").removeEventListener("click", prefectOff);
    document.querySelector("#prefect_button").removeEventListener("click", makePrefect);
    document.querySelector("#expell_button").removeEventListener("click", expell);
  });

  popup.querySelector("#image").src = student.image;
  popup.querySelector(".firstname").textContent = "First name: " + student.firstName;
  popup.querySelector(".lastname").textContent = "First name: " + student.lastName;
  popup.querySelector(".middlename").textContent = "Middle name: " + student.middleName;
  popup.querySelector(".nickname").textContent = "Last name: " + student.nickName;
  popup.querySelector(".gender").textContent = "Gender: " + student.gender;
  popup.querySelector(".house").textContent = "House: " + student.house;
  popup.querySelector(".bloodstatus").textContent = "Bloodstatus: " + student.bloodstatus;
  if (student.house === "Slytherin" && student.bloodstatus === "pure") {
    popup.querySelector(".inqsquad").textContent = "Part of Inq. Squad: " + student.inqsquad;
  } else {
    popup.querySelector("#inqSquad_button").classList.add("hidden");
  }

  popup.querySelector(".crest").src = `images/${student.house}_crest.png`;

  if (student.house === "Gryffindor") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #61210f 0%, #ee6c4d 74%)";
  } else if (student.house === "Slytherin") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #63d471 0%, #233329 74%)";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #36096d 0%, #37d5d6 74%)";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#popup").style.backgroundImage = "linear-gradient(315deg, #fbb034 0%, #ffdd00 74%)";
  }

  //prefect

  if (student.prefect === true) {
    document.querySelector(".prefect").textContent = "Prefect of " + `${student.house}`;
    document.querySelector("#prefect_button").textContent = "Remove as prefect";
  } else {
    document.querySelector(".prefect").textContent = "";
    document.querySelector("#prefect_button").textContent = "Make a prefect";
  }
  if (student.prefect === false) {
    document.querySelector("#prefect_button").addEventListener("click", makePrefect);
  } else {
    document.querySelector("#prefect_button").addEventListener("click", prefectOff);
  }
  function makePrefect() {
    console.log(student.firstName + " is a Prefect");
    document.querySelector("#prefect_button").removeEventListener("click", makePrefect);
    checkingPrefectNumbers(student);
  }
  function prefectOff() {
    console.log(student.firstName + " is not a Prefect");
    document.querySelector("#prefect_button").removeEventListener("click", prefectOff);
    removePrefect(student);
  }
  //expell
  if (student.expelled === false) {
    popup.querySelector(".expelled").textContent = "";
    popup.querySelector("#expell_button").textContent = `Expell student`;
  } else if (student.expelled === true) {
    popup.querySelector(".expelled").textContent = "STUDENT IS EXPELLED";
    popup.querySelector("#expell_button").textContent = `Welcome back ${student.firstName}`;
  }

  function expell(student) {
    document.querySelector("#expell_button").removeEventListener("click", expell);
    expellStudent(student);
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
  if (student.prefect === false) {
    popup.querySelector("#prefect_button").textContent = "Make student prefect";
    popup.querySelector("#prefecticon").classList.add("hidden");
  } else if (student.prefect === true) {
    popup.querySelector("#prefect_button").textContent = "Remove student prefect";
    popup.querySelector("#prefecticon").classList.remove("hidden");
  }

  popup.querySelector("#close_popup").addEventListener("click", removePopUp);
}

function removePopUp() {
  document.querySelector("#popup").classList.add("hidden");
  document.querySelector("#popup").classList.remove("popupstyle");
  buildList();
}

////PREFECT////
function removePrefect(student) {
  console.log("remove prefect for " + student.firstName);
  student.prefect = false;
  displayPopUp(student);
}
function addPrefect(student) {
  console.log("add prefect for " + student.firstName);
  student.prefect = true;
  displayPopUp(student);
}

function checkingPrefectNumbers(student) {
  let prefectArray = [];

  if (student.house === "Gryffindor") {
    prefectArray = prefectsGryffindor;
  } else if (student.house === "Hufflepuff") {
    prefectArray = prefectsHufflepuff;
  } else if (student.house === "Ravenclaw") {
    prefectArray = prefectsRavenclaw;
  } else if (student.house === "Slytherin") {
    prefectArray = prefectsSlytherin;
  }

  // console.log(prefectArray);

  if (prefectArray.length < 2) {
    student.prefect = true;
    prefectArray.push(student);
    displayPopUp(student);
    // console.log(student);
  } else if (prefectArray.length > 1) {
    document.querySelector("#prefectConflict .student").textContent = `${student.firstName} ${student.lastName}`;
  }
}

function expellStudent(student) {
  student.expelled = true;
  allStudents.splice(allStudents.indexOf(student), 1);
  expelledData.push(student);
  displayPopUp(student);
  buildList();
}

//// SORT AND FILTERING ////

function selectedFilter() {
  const filter = this.value;
  filterList(filter);
}

function filterList() {
  let filteredList = allStudents;

  if (selector.value === "all") {
    displayList(filteredList);
  } else if (selector.value === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (selector.value === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (selector.value === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (selector.value === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (selector.value === "expelled") {
    filteredList = expelledData;
  }
  displayList(filteredList);
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
//expelled-filter DOESNT WORK
function isExpelled(student) {
  return student.expelled == true;
}

function sorter() {
  let sorted = allStudents;
  let sorter = this.dataset.filter;
  if (sorter === "filterFirstNameAtoZ") {
    console.log("virker?");
    sorted.sort(sortFirstName);
  } else if (sorter === "filterLastNameAtoZ") sorted.sort(sortLastName);
  buildList(sorted);
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

function searchForStudent(input) {
  console.log(input.target.value);
  let searchList = students.filter((student) => student.fullname.toLowerCase().includes(input.target.value));
  displayList(searchList);
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
