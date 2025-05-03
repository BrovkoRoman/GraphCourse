import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"
import {Task} from "./task.jsx"
import {Test} from "./test.jsx"
import {toBase64} from "../utils/toBase64.js"

function makeTeacher() {
    const makeTeacherInput = document.getElementById("makeTeacher");
    if(makeTeacherInput.value === "") {
        alert("Поле должно быть непустым");
        return;
    }
    fetch("http://localhost:8080/make-teacher",
    {
        headers: {
          'Content-Type': 'plain/text'
        },
        method: "PUT",
        credentials: 'include',
        body: makeTeacherInput.value
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
    })
}

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.addSection = this.addSection.bind(this);
        this.state = {
            lectures: [],
            sections: [],
            tasks: [],
            taskScores: [],
            tests: [],
            testScores: [],
            role: getCookieValue("role")
        };
    }

    addSection() {
        const addSectionInput = document.getElementById("addSection");
        if(addSectionInput.value === "") {
            alert("Поле должно быть непустым");
            return;
        }
        const addedSection = {
            name: addSectionInput.value
        };
        fetch("http://localhost:8080/new-section",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(addedSection)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.setState((state) => {
                addedSection.id = result;
                state.sections.push(addedSection);
                return state;
            });
        })
    }

    async addLecture(sectionId) {
        console.log("addLecture");
        const addLectureInput = document.getElementById("addLecture_" + sectionId);
        console.log(addLectureInput.files);
        for(let i = 0; i < addLectureInput.files.length; i++) {
            const file = addLectureInput.files[i];
            const fileContent = await toBase64(file);
            const arr = fileContent.split(",");
            const mimeType = arr[0].split(";")[0];
            const addedLecture = {
                sectionId: sectionId,
                fileName: file.name,
                mimeType: mimeType,
                fileContent: arr[1]
            };
            const addedLectureWithoutContent = {
                sectionId: sectionId,
                fileName: file.name
            };

            fetch("http://localhost:8080/new-lecture",
            {
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(addedLecture)
            })
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.setState((state) => {
                    addedLectureWithoutContent.id = result;
                    state.lectures.push(addedLectureWithoutContent);
                    console.log("state");
                    console.log(state);
                    return state;
                });
            })
        }
    }

    addTask(sectionId) {
        console.log("addTask");
        const addTaskNameInput = document.getElementById("addTaskName_" + sectionId);
        const addTaskInput = document.getElementById("addTask_" + sectionId);
        const maxScoreInput = document.getElementById("taskMaxScore_" + sectionId);
        if(addTaskInput.value === "" || addTaskNameInput.value === "" || maxScoreInput.value === "") {
            alert("Поля должны быть непустыми");
            return;
        }
        const maxScore = Number(maxScoreInput.value);
        if(isNaN(maxScore) || maxScore <= 0 || !Number.isInteger(maxScore)) {
            alert("Максимальный балл должен быть натуральным числом");
            return;
        }
        const addedTask = {
            sectionId: sectionId,
            name: addTaskNameInput.value,
            text: addTaskInput.value,
            maxScore: maxScore
        };
        fetch("http://localhost:8080/new-task",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(addedTask)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.setState((state) => {
                addedTask.id = result;
                state.tasks.push(addedTask);
                return state;
            });
        })
    }

    addTest(sectionId) {
        console.log("addTest");
        const addTestNameInput = document.getElementById("addTest_" + sectionId);
        const maxScoreInput = document.getElementById("testMaxScore_" + sectionId);
        if(addTestNameInput.value === "" || maxScoreInput.value === "") {
            alert("Поля должны быть непустыми");
            return;
        }
        const maxScore = Number(maxScoreInput.value);
        if(isNaN(maxScore) || maxScore <= 0 || !Number.isInteger(maxScore)) {
            alert("Максимальный балл должен быть натуральным числом");
            return;
        }
        const addedTest = {
            sectionId: sectionId,
            name: addTestNameInput.value,
            maxScore: maxScore
        };
        fetch("http://localhost:8080/new-test",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(addedTest)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.setState((state) => {
                addedTest.id = result;
                state.tests.push(addedTest);
                return state;
            });
        })
    }

  createAddButtons(sectionId) {
    if(this.state.role === "TEACHER") {
        return (
            <div className="addButtons">
                <label htmlFor={"addLecture_" + sectionId}>Добавить файл: </label>
                <input type="file" id={"addLecture_" + sectionId} /><br/>
                <button onClick={() => this.addLecture(sectionId)}>Отправить</button><br/>

                <label htmlFor={"addTaskName_" + sectionId}>Добавить задачу: </label>
                <input id={"addTaskName_" + sectionId} placeholder="название" />
                <input id={"taskMaxScore_" + sectionId} placeholder="макс. балл" /><br/>
                <textarea className="statement" id={"addTask_" + sectionId} placeholder="условие" /><br/>
                <button onClick={() => this.addTask(sectionId)}>Отправить</button><br/>

                <label htmlFor={"addTest_" + sectionId}>Добавить тест: </label>
                <input id={"addTest_" + sectionId} placeholder="название" />
                <input id={"testMaxScore_" + sectionId} placeholder="макс. балл" /><br/>
                <button onClick={() => this.addTest(sectionId)}>Отправить</button>
            </div>
        )
    }

    return null;
  }

  buildTestScore(testId, maxScore) {
    const testScoreObject = this.state.testScores.find(obj => (obj.testId === testId));
    if(!!testScoreObject) {
        return (<span> ({testScoreObject.score.toFixed(2)}/{maxScore.toFixed(2)})</span>);
    } else {
        return null;
    }
  }

  openFile(file) {
    fetch("http://localhost:8080/get-file-content?id=" + file.id)
        .then(response => response.json())
        .then(lecture => {
            const a = document.createElement('a');
            a.href = lecture.mimeType + ";base64," + lecture.fileContent;
            a.download = file.fileName;
            a.click();
        })
  }
  render() {
    const sections = this.state.sections.map((section) => {
        let taskScoresIndex = 0;
        return (
            <div>
                <h1>{section.name}</h1>
                <div id={"lectures_" + section.id} className="content">
                    {this.state.lectures.filter(lecture => (lecture.sectionId == section.id)).length === 0 ? null :
                        (<h3>Файлы</h3>)}
                    {this.state.lectures.filter(lecture => (lecture.sectionId == section.id))
                    .map(lecture => (
                        <div className="content">
                            <a className="blackLink" onClick={() => this.openFile(lecture)}>{lecture.fileName}</a>
                            <br />
                        </div>
                    ))}
                    {this.state.tests.filter(test => (test.sectionId == section.id)).length === 0 ? null :
                        (<h3>Тесты</h3>)}
                    {this.state.tests.filter(test => (test.sectionId == section.id))
                        .map(test => (
                                <div className="content">
                                    <a className="blackLink" onClick = {() => this.props.onClickTest(test)}>{test.name}
                                    {test.published ? null : (<span> (не опубликовано)</span>)}
                                    {this.buildTestScore(test.id, test.maxScore)}</a>
                                </div>
                            ))
                    }
                    {this.state.tasks.filter(task => (task.sectionId == section.id)).length === 0 ? null :
                        (<h3>Задачи</h3>)}
                    {this.state.tasks.filter(task => (task.sectionId == section.id))
                        .map(task => {
                            while(taskScoresIndex < this.state.taskScores.length &&
                                this.state.taskScores[taskScoresIndex].taskId < task.id) {
                                taskScoresIndex++;
                            }
                            return (
                                <div className="content">
                                    <a className="blackLink" onClick = {() => this.props.onClickTask(task)}>{task.name}
                                    {taskScoresIndex < this.state.taskScores.length &&
                                     this.state.taskScores[taskScoresIndex].taskId === task.id ?
                                           (<span> ({this.state.taskScores[taskScoresIndex].score}/{task.maxScore})</span>)
                                           : null}</a>
                                </div>
                            );
                        })
                    }
                    {this.createAddButtons(section.id)}
                </div>
            </div>
        )
    });

    if(this.state.role !== "TEACHER") {
        return (<div className="home">
                    <div id="sections">{sections}</div>
               </div>);
    }

    return <div className="home">
                <label htmlFor="addSection">Добавить раздел: </label>
                <input id="addSection" placeholder="название"/><br/>
                <button onClick={this.addSection}>Отправить</button><br/>

                <label htmlFor="makeTeacher">Сделать пользователя преподавателем: </label>
                <input id="makeTeacher" placeholder="пользователь"/><br/>
                <button onClick={makeTeacher}>Отправить</button><br/>

                <div id="sections">{sections}</div>
           </div>
  }

  componentDidMount() {
    if(!!this.state.role && this.state.role === "STUDENT") {
        fetch("http://localhost:8080/task-scores",
        {
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(result => {
            if(!!result) {
                result.sort((a, b) => a.taskId > b.taskId ? 1 : -1);
                this.setState({
                    taskScores: result
                })
            }
            console.log("task scores:");

            for(let x of result) {
                console.log(x);
            }
        });

        fetch("http://localhost:8080/get-test-scores",
        {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(result => {
            if(!!result) {
                this.setState({
                    testScores: result
                })
            }
        });
    }

    if(!!this.state.role && this.state.role !== "TEACHER") {
        fetch("http://localhost:8080/check-role",
                {
                    method: "GET",
                    credentials: 'include'
                })
                .then(response => response.text())
                .then(result => {
                    if(!!result) {
                        document.cookie = "role=TEACHER";
                        document.cookie = "jwt=" + result;
                        this.setState({
                            role: "TEACHER"
                        });
                    }
                })
    }

    fetch("http://localhost:8080/all-lectures-without-content")
      .then(response => response.json())
      .then(lecturesArray => {
          fetch("http://localhost:8080/all-sections")
              .then(response => response.json())
              .then(sectionsArray => {
                  fetch("http://localhost:8080/all-tasks")
                    .then(response => response.json())
                    .then(tasksArray => {
                        if(getCookieValue("role") === "TEACHER") {
                            fetch("http://localhost:8080/all-tests", {
                                credentials : 'include'
                            })
                            .then(response => response.json())
                            .then(testsArray => {
                                if(!!testsArray) {
                                    this.setState({
                                        lectures: lecturesArray,
                                        sections: sectionsArray,
                                        tasks: tasksArray,
                                        tests: testsArray
                                    });
                                }
                            });
                        } else if(getCookieValue("role") === "STUDENT") {
                            fetch("http://localhost:8080/all-published-tests")
                            .then(response => response.json())
                            .then(testsArray => {
                                if(!!testsArray) {
                                    this.setState({
                                        lectures: lecturesArray,
                                        sections: sectionsArray,
                                        tasks: tasksArray,
                                        tests: testsArray
                                    });
                                }
                            });
                        }
                    });
              });
      });



    return;
  }
}

