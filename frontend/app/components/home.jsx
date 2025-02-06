import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"
import {Task} from "./task.jsx"
import {toBase64} from "../utils/toBase64.js"

function makeTeacher() {
    const makeTeacherInput = document.getElementById("makeTeacher");
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
    .then(result => console.log(result))
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
            role: getCookieValue("role")
        };
    }

    addSection() {
        const addSectionInput = document.getElementById("addSection");
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
                    addedLecture.id = result;
                    state.lectures.push(addedLecture);
                    return state;
                });
            })
        }
    }

    addTask(sectionId) {
        console.log("addTask");
        const addTaskInput = document.getElementById("addTask_" + sectionId);
        const addTaskNameInput = document.getElementById("addTaskName_" + sectionId);
        const maxScoreInput = document.getElementById("maxScore_" + sectionId);
        const addedTask = {
            sectionId: sectionId,
            name: addTaskNameInput.value,
            text: addTaskInput.value,
            maxScore: maxScoreInput.value
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

  createAddButtons(sectionId) {
    if(this.state.role === "TEACHER") {
        return (
            <div>
                <label htmlFor={"addLecture_" + sectionId}>Add new lecture:</label>
                <input type="file" id={"addLecture_" + sectionId} /><br/>
                <button onClick={() => this.addLecture(sectionId)}>Submit</button><br/>

                <label htmlFor={"addTask_" + sectionId}>Add new task:</label>
                <input id={"addTaskName_" + sectionId} placeholder="task name" />
                <input id={"addTask_" + sectionId} placeholder="task text" />
                <input id={"maxScore_" + sectionId} placeholder="max score" /><br/>
                <button onClick={() => this.addTask(sectionId)}>Submit</button>
            </div>
        )
    }

    return null;
  }

  render() {
    const sections = this.state.sections.map((section) => {
        let taskScoresIndex = 0;
        return (
            <div>
                <h1>{section.name}</h1>
                <div id={"lectures_" + section.id}>{section.name}
                    {this.state.lectures.filter(lecture => (lecture.sectionId == section.id))
                    .map(lecture => (
                        <div>
                            <a download={lecture.fileName}
                               href={lecture.mimeType + ";base64," + lecture.fileContent}>{lecture.fileName}</a>
                            <br />
                        </div>
                    ))}
                    {this.state.tasks.filter(task => (task.sectionId == section.id))
                    .map(task => {
                        while(taskScoresIndex < this.state.taskScores.length &&
                            this.state.taskScores[taskScoresIndex].taskId < task.id) {
                            taskScoresIndex++;
                        }
                        return (
                            <div>
                                <a onClick = {() => this.props.onClickTask(task)}>{task.name}</a>
                                {taskScoresIndex < this.state.taskScores.length &&
                                 this.state.taskScores[taskScoresIndex].taskId === task.id ?
                                       (<span> {this.state.taskScores[taskScoresIndex].score}/{task.maxScore}</span>) : null}
                            </div>
                        );
                    }
                    )}
                    {this.createAddButtons(section.id)}
                </div>
            </div>
        )
    });

    if(this.state.role !== "TEACHER") {
        return (<div>
                    <div id="sections">{sections}</div>
               </div>);
    }

    return <div>
                <label htmlFor="addSection">Add new section:</label>
                <input id="addSection" placeholder="section name"/><br/>
                <button onClick={this.addSection}>Submit</button><br/>

                <label htmlFor="makeTeacher">Add teacher role to user: </label>
                <input id="makeTeacher" placeholder="username"/><span> </span>
                <button onClick={makeTeacher}>Make teacher</button><br/>

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
          fetch("http://localhost:8080/all-sections")
              .then(response => response.json())
              .then(sectionsArray => {
                  fetch("http://localhost:8080/all-tasks")
                    .then(response => response.json())
                    .then(tasksArray => {
                      this.setState({
                        lectures: lecturesArray,
                        sections: sectionsArray,
                        tasks: tasksArray,
                      });
                    });
              });
      });



    return;
  }
}

