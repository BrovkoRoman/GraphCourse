import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"
import {Task} from "./task.jsx"
import {Test} from "./test.jsx"
import {toBase64} from "../utils/toBase64.js"

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.addSection = this.addSection.bind(this);
        this.state = {
            files: [],
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

    async addFile(sectionId) {
        console.log("addFile");
        const addFileInput = document.getElementById("addFile_" + sectionId);
        console.log(addFileInput.files);
        for(let i = 0; i < addFileInput.files.length; i++) {
            const file = addFileInput.files[i];
            const fileContent = await toBase64(file);
            const arr = fileContent.split(",");
            const mimeType = arr[0].split(";")[0];
            const addedFile = {
                sectionId: sectionId,
                fileName: file.name,
                mimeType: mimeType,
                fileContent: arr[1]
            };
            const addedFileWithoutContent = {
                sectionId: sectionId,
                fileName: file.name
            };

            fetch("http://localhost:8080/new-file",
            {
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                credentials: 'include',
                body: JSON.stringify(addedFile)
            })
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.setState((state) => {
                    addedFileWithoutContent.id = result;
                    state.files.push(addedFileWithoutContent);
                    console.log("state");
                    console.log(state);
                    return state;
                });
            })
        }
    }

    addLecture(sectionId) {
        const addLectureInput = document.getElementById("addLecture_" + sectionId);

        if(addLectureInput.value === "") {
            alert("Поле должно быть непустым");
            return;
        }

        const addedLecture = {
            sectionId: sectionId,
            name: addLectureInput.value
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
            this.setState(state => {
                addedLecture.id = result;
                state.lectures.push(addedLecture);
                return state;
            });
        });
    }

    addTask(sectionId) {
        console.log("addTask");
        const addTaskNameInput = document.getElementById("addTaskName_" + sectionId);
        const addTaskInput = document.getElementById("addTask_" + sectionId); // task statement
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

    deleteFile(fileId) {
        fetch("http://localhost:8080/delete-file?id=" + fileId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        });
    }
    deleteLecture(lectureId) {
        fetch("http://localhost:8080/delete-lecture?id=" + lectureId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        });
    }
    deleteTask(taskId) {
        fetch("http://localhost:8080/delete-task?id=" + taskId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        })
    }
    deleteTest(testId) {
        fetch("http://localhost:8080/delete-test?id=" + testId,
        {
            method: "DELETE",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
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
                <details>
                    <summary className="home-add-button">Добавить лекцию</summary>
                    <input id={"addLecture_" + sectionId} placeholder="название" className="mt10"/>
                    <button onClick={() => this.addLecture(sectionId)} className="ml20">Отправить</button><br/>
                </details>

                <details>
                    <summary className="home-add-button">Добавить задачу</summary>
                    <input id={"addTaskName_" + sectionId} placeholder="название" className="mt10 ml35"/>
                    <input id={"taskMaxScore_" + sectionId} placeholder="макс. балл" className="ml10"/><br/>
                    <textarea className="statement" id={"addTask_" + sectionId} placeholder="условие" /><br/>
                    <button onClick={() => this.addTask(sectionId)} className="ml20">Отправить</button><br/>
                </details>

                <details>
                    <summary className="home-add-button">Добавить тест</summary>
                    <input id={"addTest_" + sectionId} placeholder="название" className="mt10"/>
                    <input id={"testMaxScore_" + sectionId} placeholder="макс. балл" className="ml10"/>
                    <button onClick={() => this.addTest(sectionId)} className="ml10">Отправить</button>
                </details>
            </div>
        )
    }

    return (<br/>);
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
        .then(fileContentDto => {
            console.log("name", file.fileName);
            const a = document.createElement('a');
            a.href = fileContentDto.mimeType + ";base64," + fileContentDto.fileContent;
            a.download = file.fileName;
            a.click();
        })
  }
  render() {
    console.log(this.state.files);
    const sections = this.state.sections.map((section) => {
        let taskScoresIndex = 0;
        return (
            <div>
                <details>
                    <summary className="summary">{section.name}</summary>
                    <div id={"files_" + section.id} className="ml35">
                        {this.state.lectures.filter(lecture => (lecture.sectionId == section.id)).length === 0 ? null :
                            (<h3>Лекции</h3>)}
                        {this.state.lectures.filter(lecture => (lecture.sectionId == section.id))
                        .map(lecture => (
                            <div className="content">
                                <a className="blackLink" onClick = {() => this.props.onClickLecture(lecture)}>{lecture.name}</a>
                                {this.state.role === "TEACHER" ?
                                    (<a className="blackLink"
                                        onClick={() => {this.deleteLecture(lecture.id)}}> &#10006;</a>) :
                                    null}
                                <br />
                            </div>
                        ))}
                        {this.state.files.filter(file => (file.sectionId == section.id)).length === 0 ? null :
                            (<h3>Файлы</h3>)}
                        {this.state.files.filter(file => (file.sectionId == section.id))
                        .map(file => (
                            <div className="content">
                                <a className="blackLink" onClick={() => this.openFile(file)}>{file.fileName}</a>
                                {this.state.role === "TEACHER" ?
                                    (<a className="blackLink"
                                        onClick={() => {this.deleteFile(file.id)}}> &#10006;</a>) :
                                    null}
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
                                        {this.state.role === "TEACHER" ?
                                            (<a className="blackLink"
                                                onClick={() => {this.deleteTest(test.id)}}> &#10006;</a>) :
                                            null}
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
                                        {this.state.role === "TEACHER" ?
                                            (<a className="blackLink"
                                                onClick={() => {this.deleteTask(task.id)}}> &#10006;</a>) :
                                            null}
                                    </div>
                                );
                            })
                        }
                        {this.createAddButtons(section.id)}
                    </div>
                </details>
            </div>
        )
    });

    if(this.state.role !== "TEACHER") {
        return (<div className="home">
                    <div id="sections">{sections}</div>
               </div>);
    }

    return <div className="home">
                <details>
                <summary className="home-advanced-button">Добавить тему</summary>
                    <input id="addSection" placeholder="название" className="mt10"/>
                    <button onClick={this.addSection} className="ml20">Отправить</button><br/>
                </details>
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

    fetch("http://localhost:8080/all-lectures")
      .then(response => response.json())
      .then(lecturesArray => {
        fetch("http://localhost:8080/all-files-without-content")
          .then(response => response.json())
          .then(filesArray => {
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
                                        sectionsArray.sort((a, b) => a.id - b.id);
                                        this.setState({
                                            files: filesArray,
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
                                        sectionsArray.sort((a, b) => a.id - b.id);
                                        this.setState({
                                            lectures: lecturesArray,
                                            files: filesArray,
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
    });



    return;
  }
}

