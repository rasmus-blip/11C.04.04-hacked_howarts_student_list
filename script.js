"use strict";

//starts the program
window.addEventListener("DOMContentLoaded", start);

//create the needed arrays
let allStudents = [];
let students = [];
let expelledData = [];
let inqsquadData = []; // not in use
let familyBlood = [];
let hasBeenHacked = false;
let prefectData = []; // not in use
let searchList = [];

//global constants and variables for easier access,
/// - i could maybe have used this more ¯\_(ツ)_/¯
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
  bloodstatus: "",
  inqsquad: false,
  prefect: false,
  expelled: false,
};

//initialize program
function start() {
  loadExternalData();
  addEventlisteners();
}

//load in the .json files
function loadExternalData() {
  let isBloodLoaded = false;

  loadJSON("https://petlatkea.dk/2021/hogwarts/families.json", setFamilyBloodStatus);
  loadJSON("https://petlatkea.dk/2021/hogwarts/students.json", isBloodStatusLoaded);

  async function loadJSON(url, callback) {
    const response = await fetch(url);
    const jsonData = await response.json();
    callback(jsonData);
  }

  function setFamilyBloodStatus(jsonData) {
    const half = jsonData.half;
    const pure = jsonData.pure;

    familyBlood.half = half;
    familyBlood.pure = pure;
    isBloodLoaded = true;
  }

  //  waits to continue until both the familyblood and studentinfo is loaded
  function isBloodStatusLoaded(jsonData) {
    if (isBloodLoaded === false) {
      console.log(isBloodLoaded);
      setTimeout(isBloodStatusLoaded(jsonData), 100);
    } else {
      cleanData(jsonData);
    }
  }
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
    student.bloodstatus = getBloodStatus(student);
  });

  buildList();
}

//separates the data and returns
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
//capitalizes the data and returns
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
//return the string for the src of the studentimage
function getImage(student) {
  student.image = `images/${student.lastName}_${student.firstName.charAt(0)}.png`;

  return student;
}
//return the bloodstatus
function getBloodStatus(student) {
  //sets blood status according to how they are listed
  if (familyBlood.pure.some(compareFamilyNames)) {
    return "Pure";
  } else if (familyBlood.half.some(compareFamilyNames)) {
    return "Half";
  } else {
    return "Muggle born"; //if not on the families.json list then they become muggle
  }

  function compareFamilyNames(familyName) {
    if (familyName.toLowerCase() === student.lastName.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }
}

//add eventlisteners to universal buttons and whatnot
function addEventlisteners() {
  //listens on dropdown filter
  selector.addEventListener("change", selectedFilter);

  //listens on sorters
  document.querySelectorAll(".filterbutton").forEach((button) => {
    button.addEventListener("click", sorter);
  });
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
  let amount = students.length;

  //listens on dobby to hack the system >:D
  document.querySelector("#dobby").addEventListener("click", hackTheSystem);

  document.querySelector("#amount").textContent = amount;
  // build a new list
  students.forEach(displayStudent);
}

//display students on the list
function displayStudent(student) {
  // create clone
  const klon = document.querySelector("template").content.cloneNode(true);
  klon.querySelector("li").addEventListener("click", () => displayPopUp(student));

  // sets clone data
  klon.querySelector("[data-field=firstname]").innerHTML = student.firstName;
  klon.querySelector("[data-field=lastname]").innerHTML = student.lastName;
  klon.querySelector("[data-field=house]").innerHTML = student.house;

  // append clone to main
  document.querySelector("main").appendChild(klon);
}

//display popup with details of student
function displayPopUp(student) {
  const popup = document.querySelector("#popup");

  // displays the popup
  popup.classList.remove("hidden");
  popup.classList.add("popupstyle");

  // fills the popup with information about the student
  popup.querySelector("#image").src = student.image.toLowerCase();
  popup.querySelector(".firstname").textContent = "First name: " + student.firstName;
  popup.querySelector(".lastname").textContent = "Last name: " + student.lastName;
  popup.querySelector(".middlename").textContent = "Middle name: " + student.middleName;
  popup.querySelector(".nickname").textContent = "Last name: " + student.nickName;
  popup.querySelector(".gender").textContent = "Gender: " + student.gender;
  popup.querySelector(".house").textContent = "House: " + student.house;
  popup.querySelector(".bloodstatus").textContent = "Bloodstatus: " + student.bloodstatus;

  // only pureblooded and slytherin can have the inq. squad button
  if ((student.expelled === false && student.bloodstatus === "Pure") || student.house === "Slytherin") {
    document.querySelector("#inqSquad_button").classList.remove("hidden");
  } else {
    popup.querySelector(".inqsquad").textContent = "";
    document.querySelector("#inqSquad_button").classList.add("hidden");
  }

  if (student.inqsquad === false && student.expelled === false) {
    document.querySelector("#inqSquad_button").textContent = "Add to Inquisitional Squad";
    popup.querySelector("#umbridge").classList.add("hidden");
  } else if (student.inqsquad === true && student.expelled === false) {
    document.querySelector("#inqSquad_button").textContent = "Remove from Inquisitional Squad";
    popup.querySelector("#umbridge").classList.remove("hidden");
  }

  // changes the text of the prefect button according to prefect situation,
  // adds or hides the prefect crest
  if (student.prefect === false) {
    document.querySelector("#prefect_button").textContent = "Add student prefect";
    document.querySelector("#prefecticon").classList.add("hidden");
  } else {
    document.querySelector("#prefect_button").textContent = "Remove student prefect";
    document.querySelector("#prefecticon").classList.remove("hidden");
  }

  // sets the theme of the popup according to house
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

  // sets or unset the buttons according to expelled status
  if (student.expelled === true) {
    popup.querySelector(".expelled").textContent = "STUDENT IS EXPELLED";
    popup.querySelector("#inqSquad_button").classList.add("hidden");
    popup.querySelector("#prefect_button").classList.add("hidden");
    popup.querySelector("#expell_button").classList.add("hidden");
  } else if (student.expelled === false) {
    popup.querySelector("#expell_button").classList.remove("hidden");
    popup.querySelector("#prefect_button").classList.remove("hidden");
    popup.querySelector(".expelled").textContent = "";
    popup.querySelector("#expell_button").textContent = `Expell student`;
  }

  //listens &  starts the expell function and closes the popup
  document.querySelector("#expell_button").addEventListener("click", expellStudentClosure);
  function expellStudentClosure() {
    document.querySelector("#expell_button").removeEventListener("click", expellStudentClosure);

    if (student.expelled === "unexpellable") {
      alert("this student cannot be expelled"); //i cannot be expelled
    } else {
      expellStudent(student);
    }
  }

  //listens &  starts the prefect function
  popup.querySelector("#prefect_button").addEventListener("click", addPrefectClosure);
  function addPrefectClosure() {
    popup.querySelector("#prefect_button").removeEventListener("click", addPrefectClosure);
    addPrefect(student);
  }

  //listens & starts the inq. squad function
  document.querySelector("#inqSquad_button").addEventListener("click", addInqSquadClosure);
  function addInqSquadClosure() {
    popup.querySelector("#inqSquad_button").removeEventListener("click", addInqSquadClosure);
    addInqSquad(student);
  }

  popup.querySelector("#close_popup").addEventListener("click", removePopUp);
}

//remove the popup
function removePopUp() {
  document.querySelector("#close_popup").removeEventListener("click", removePopUp);
  document.querySelector("#popup").classList.add("hidden");
  document.querySelector("#popup").classList.remove("popupstyle");
  buildList();
}

///////STUDENT FEATURES///////
//expell a student aka. removes them from the list and insert them into the expelled list
function expellStudent(student) {
  student.expelled = !student.expelled;
  allStudents.splice(allStudents.indexOf(student), 1);
  expelledData.push(student);
  removePopUp();
}

//add student to inquisitional squad
function addInqSquad(student) {
  student.inqsquad = !student.inqsquad;
  inqsquadData.push(student); //not in use

  // if the system has been hacked, then anyone added to inq. squad gets removed after
  if (hasBeenHacked === true) {
    setTimeout(5000, (student.inqsquad = !student.inqsquad));
    console.log(student);
  }
  removePopUp();
}

function hackedInqSquad(student) {
  student.inqsquad = !student.inqsquad;
}

//add prefect to student
function addPrefect(student) {
  const sameGenderAndHouse = allStudents.filter(checkGenderAndHouse);

  //check if there af any the student have any classmates of same gender that are prefect
  function checkGenderAndHouse(compareStudent) {
    if (student.house === compareStudent.house && student.gender === compareStudent.gender && compareStudent.prefect == true) {
      return true;
    } else {
      return false;
    }
  }

  if (student.prefect === true) {
    student.prefect = !student.prefect;
    buildList();
    removePopUp();
  } else if (sameGenderAndHouse.length >= 1) {
    prefectConflict(sameGenderAndHouse, student);
  } else if (student.prefect === false) {
    student.prefect = !student.prefect;
    buildList();
    removePopUp();
  }
}

//starts if theres is a conflict
function prefectConflict(sameGenderAndHouse, student) {
  document.querySelector("#prefectConflict").classList.add("show");
  document.querySelector("#prefectConflict .student").textContent = `${sameGenderAndHouse[0].firstName} ${sameGenderAndHouse[0].lastName}`;
  document.querySelector("#prefectConflict [data-action=remove]").addEventListener("click", togglePrefect);
  document.querySelector(".closebutton_dialog").addEventListener("click", removeDialog);

  //toggles the prefect status of the student and the other filling the criteria
  function togglePrefect() {
    sameGenderAndHouse[0].prefect = !sameGenderAndHouse[0].prefect;
    document.querySelector("#prefectConflict [data-action=remove]").removeEventListener("click", togglePrefect);
    document.querySelector("#prefectConflict").classList.remove("show");
    student.prefect = !student.prefect;
    removePopUp();
  }

  //closes the conflict dialog
  function removeDialog() {
    document.querySelector(".closebutton_dialog").removeEventListener("click", removeDialog);
    document.querySelector("#prefectConflict").classList.remove("show");
    removePopUp();
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
  searchList = students.filter((student) => student.fullname.toLowerCase().includes(input.target.value));
  displayList(searchList);
}

// randomize blood status, push me into list, limited inq. time, can be only done once
function hackTheSystem() {
  if (hasBeenHacked === false) {
    hasBeenHacked = true;
    let rasmus = {
      firstName: "Rasmus",
      lastName: "Voldemort",
      middleName: "",
      nickName: "",
      gender: "",
      house: "Slytherin",
      bloodstatus: "Pure",
      image: "images/voldemort_l.png",
      inqsquad: true,
      prefect: true,
      expelled: "unexpellable",
    };
    allStudents.push(rasmus);
    document.querySelector("#dobby").src = "images/voldemort_l2.png";
    document.querySelector("#dobby").style.margin = "20px";
    mixBloodStatus();
  } else if (hasBeenHacked === true) {
    alert("error! please delete system32 before next hack");
  }
}

function mixBloodStatus() {
  allStudents.forEach(randomizer);
  buildList();
}

function randomizer(student) {
  const rndNumber = Math.floor(Math.random() * 3) + 1;

  if (student.bloodstatus === "Muggle born" || student.bloodstatus === "Half") {
    student.bloodstatus = "Pure";
  } else if (rndNumber === 1) {
    student.bloodstatus = "Muggle born";
  } else if (rndNumber === 2) {
    student.bloodstatus = "Half";
  } else {
    student.bloodstatus = "Pure";
  }
}
