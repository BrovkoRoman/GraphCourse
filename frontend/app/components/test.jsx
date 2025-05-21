import React from 'react'
import {getCookieValue} from "../utils/getCookie.js"

export class Test extends React.Component {
    constructor(props) {
        super(props);
        this.changeQuestionType = this.changeQuestionType.bind(this);
        this.addPossibleAnswer = this.addPossibleAnswer.bind(this);
        this.addQuestionWithTextAnswer = this.addQuestionWithTextAnswer.bind(this);
        this.addQuestionWithSingleOrMultipleAnswer = this.addQuestionWithSingleOrMultipleAnswer.bind(this);
        this.submitTest = this.submitTest.bind(this);
        this.publishTest = this.publishTest.bind(this);
        this.state = {
            questions: [],              // already created questions
            possibleAnswers: [],        // variants of answer to already created questions
            addingQuestionType: "1",    // type of currently creating question
            addingPossibleAnswers: [],   // variants of answer to currently creating question
            submitted: false,
            correctAnswers: [], // array of PossibleAnswerDto
            studentAnswers: {score: null, answers: []} // studentTestResponseDto
        };
    }

    changeQuestionType() {
        const addQuestionSelect = document.getElementById("addQuestionSelect");
        this.setState({addingQuestionType: addQuestionSelect.value});
    }

    addQuestionWithTextAnswer() {
        const questionEntity = {
            testId: this.props.test.id,
            type: this.state.addingQuestionType,
            text: document.getElementById("question").value
        };
        const addingPossibleAnswers = [{
            text: document.getElementById("answer").value,
            correct: "true"
        }];

        if(questionEntity.text.length == 0) {
            alert("Введите текст вопроса");
            return;
        }

        if(addingPossibleAnswers[0].text == 0) {
            alert("Введите правильный ответ");
            return;
        }

        const questionRequestDto = {
            questionEntity: questionEntity,
            possibleAnswers: addingPossibleAnswers
        };

        fetch("http://localhost:8080/new-question",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(questionRequestDto)
        })
        .then(response => response.text())
        .then(result => {
            if(result !== "ok") {
                alert(result);
            }
            this.componentDidMount();
        });
    }
    addQuestionWithSingleOrMultipleAnswer() {
        const questionEntity = {
            testId: this.props.test.id,
            type: this.state.addingQuestionType,
            text: document.getElementById("question").value
        };
        let addingPossibleAnswers = [];
        let correctAnswerChosen = false;

        for(let i = 0; i < this.state.addingPossibleAnswers.length; i++) {
            const currentAnswerCheckbox = document.getElementById("answer_" + (i + 1));

            if(currentAnswerCheckbox.checked) {
                correctAnswerChosen = true;
            }

            addingPossibleAnswers.push({
                text: this.state.addingPossibleAnswers[i],
                correct: currentAnswerCheckbox.checked
            });
        }

        if(questionEntity.text.length == 0) {
            alert("Введите текст вопроса");
            return;
        }

        if(this.state.addingPossibleAnswers.length === 0) {
            alert("Добавьте варианты ответа");
            return;
        }

        if(!correctAnswerChosen) {
            alert("Выберите правильный ответ");
            return;
        }

        const questionRequestDto = {
            questionEntity: questionEntity,
            possibleAnswers: addingPossibleAnswers
        };

        fetch("http://localhost:8080/new-question",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(questionRequestDto)
        })
        .then(response => response.text())
        .then(result => {
            if(result !== "ok") {
                alert(result);
            }
            this.setState({addingPossibleAnswers: []},
                this.componentDidMount());
        });
    }

    createAddingTextAnswer() {
        return (<div>
                    <input id="question" placeholder="вопрос" className="mt5"/><br/>
                    <input id="answer" placeholder="ответ" className="mt5"/><br/>
                    <button onClick={this.addQuestionWithTextAnswer} className="mt10">Отправить</button>
                </div>
        );
    }

    addPossibleAnswer() {
        const addingPossibleAnswerInput = document.getElementById("addingPossibleAnswer");
        this.setState(state => {
            state.addingPossibleAnswers.push(addingPossibleAnswerInput.value);
            return state;
        })
    }

    createAddingSingleAnswer() {
        let answerIndex = 0;
        return (<div>
                    <input id="question" placeholder="текст вопроса" className="mt5"/><br/>
                    {this.state.addingPossibleAnswers.map(answer => (
                        <div>
                            <input type="radio" name="1" id={"answer_" + (++answerIndex)}/>
                            <label htmlFor={"answer_" + answerIndex}>{answer}</label>
                        </div>
                    ))}
                    <input id="addingPossibleAnswer" className="mt5"
                    placeholder="вариант ответа"/> <button onClick={this.addPossibleAnswer}>Добавить</button><br/>
                    <button onClick={this.addQuestionWithSingleOrMultipleAnswer}>Отправить</button>
                </div>
        );
    }

    createAddingMultipleAnswers() {
        let answerIndex = 0;
        return (<div>
                    <input id="question" placeholder="текст вопроса" className="mt5"/><br/>
                    {this.state.addingPossibleAnswers.map(answer => (
                        <div>
                            <input type="checkbox" name="1" id={"answer_" + (++answerIndex)}/>
                            <label htmlFor={"answer_" + answerIndex}>{answer}</label>
                        </div>
                    ))}
                    <input id="addingPossibleAnswer"
                    placeholder="вариант ответа" className="mt5"/> <button onClick={this.addPossibleAnswer}>Добавить</button><br/>
                    <button onClick={this.addQuestionWithSingleOrMultipleAnswer}>Отправить</button>
                </div>
        );
    }

    submitTest() {
        let studentAnswerInputs = document.querySelectorAll(".studentAnswer");
        //console.log(studentAnswerInputs);
        let answers = []; // array of {questionId, answer} where answer is text or id of possible answer

        for(let input of studentAnswerInputs) {
            if(input.type === "text") {
                answers.push({
                    questionId: input.dataset.questionId,
                    answer: input.value
                });
            } else if(input.checked) {
                answers.push({
                    questionId: input.dataset.questionId,
                    answer: input.dataset.answerId
                });
            }
        }

        let testSubmissionDto = {
            testId: this.props.test.id,
            answers: answers
        };

        fetch("http://localhost:8080/submit-test",
        {
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(testSubmissionDto)
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.componentDidMount();
        });
    }

    publishTest() {
        if(this.state.questions.length === 0) {
            alert("Тест не должен быть пустым");
            return;
        }

        fetch("http://localhost:8080/publish-test?testId=" + this.props.test.id,
        {
            method: "PUT",
            credentials: 'include'
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            this.props.toHome();
        });
    }

    getChecked(possibleAnswer) { // returns true if the student chose this answer in their submission
        return !!this.state.studentAnswers.answers.find(answerDto => (
            answerDto.questionId === possibleAnswer.questionId
                && answerDto.answer == possibleAnswer.id
        ));
    }

    getCorrectnessLabel(possibleAnswer) { // label about correctness of the answer (cross or check mark or null)
                                           // (for questions with non-text answer)
        const chosen = this.getChecked(possibleAnswer);
        const correctAnswer = this.state.correctAnswers.find(correctAnswer => (
            correctAnswer.id == possibleAnswer.id
        ));
        const isCorrect = !!correctAnswer;

        if(isCorrect) {
            if(chosen) {
                return (<span style={{color: "green"}}>&#10004;</span>);
            } else {
                return (<span style={{color: "red"}}>&#10004;</span>);
            }
        } else {
            if(chosen) {
                return (<span style={{color: "red"}}>&#10006;</span>);
            } else {
                return null;
            }
        }
    }

    getCorrectnessLabelForTextAnswer(questionId) {
        const studentAnswer = this.state.studentAnswers.answers.find(answerDto =>
            (answerDto.questionId === questionId));

        const correctAnswer = this.state.correctAnswers.find(correctAnswer => (
            correctAnswer.questionId === questionId
        ));

        if(!!correctAnswer && !!studentAnswer && studentAnswer.answer === correctAnswer.text) {
            return (<span style={{color: "green"}}>&#10004;</span>);
        } else {
            return (<span style={{color: "red", marginLeft: "10px"}}>&#10006;&nbsp; Правильный ответ:
                {!!correctAnswer ? " " + correctAnswer.text : null}</span>);
        }
    }

    render() {
        let questionIndex = 0;

        if(getCookieValue("role") === "TEACHER") {
            return (<div className="test">
                        <h1>{this.props.test.name}</h1>
                        {this.state.questions.map(question => (
                            <div className="question content">
                                {++questionIndex}. {question.text}<br/>
                                {this.state.possibleAnswers.filter(answer => answer.questionId === question.id)
                                    .map(answer => (
                                        <div>
                                            {question.type == 2 ? <input type="radio" disabled /> :
                                            question.type == 3 ? <input type="checkbox" disabled />
                                            : null} {answer.text}
                                        </div>
                                    )
                                )}
                                {question.type == 1 ? <input disabled className="content mt10"/> : null}
                            </div>
                        ))}

                        {this.props.test.published ? null : (
                            <div>
                                <h2>Добавить вопрос</h2>
                                <select id="addQuestionSelect" onChange={this.changeQuestionType}>
                                    <option value="1">Текстовый ответ</option>
                                    <option value="2">Один ответ</option>
                                    <option value="3">Много ответов</option>
                                </select>
                                {this.state.addingQuestionType === "1" ? this.createAddingTextAnswer() :
                                this.state.addingQuestionType === "2" ? this.createAddingSingleAnswer() :
                                this.state.addingQuestionType === "3" ? this.createAddingMultipleAnswers() : null}
                                <button onClick={this.publishTest} className="mt10">Опубликовать тест</button>
                            </div>
                        )}

                   </div>
            );
        }

        if(getCookieValue("role") === "STUDENT") {
            if(this.state.submitted) {
                let isLastInputChecked = false;
                return (<div className="test">
                            <h1>{this.props.test.name} ({this.state.studentAnswers.score.toFixed(2)}
                            /{this.props.test.maxScore.toFixed(2)})</h1>
                            {this.state.questions.map(question => (
                                <div className="question content">
                                    {++questionIndex}. {question.text}<br/>
                                    {this.state.possibleAnswers.filter(answer => answer.questionId === question.id)
                                        .map(answer => (
                                            <div>
                                                {question.type == 2 ?
                                                    <span>
                                                        <input disabled
                                                            checked={this.getChecked(answer)}
                                                        type="radio"/>{answer.text} {this.getCorrectnessLabel(answer)}
                                                    </span> :
                                                question.type == 3 ?
                                                <span>
                                                    <input disabled
                                                        checked={this.getChecked(answer)}
                                                    type="checkbox"/>
                                                    {answer.text} {this.getCorrectnessLabel(answer)}
                                                </span>
                                                :
                                                null}
                                            </div>
                                        )
                                    )}
                                    {question.type == 1 ?
                                        <span>
                                            <input disabled className="content"
                                            value = {this.state.studentAnswers.answers.find(answerDto =>
                                                (answerDto.questionId === question.id)).answer
                                            }/> {this.getCorrectnessLabelForTextAnswer(question.id)}
                                        </span>
                                         : null}
                                </div>
                            ))}
                        </div>
                );
            }
            return (<div className="test">
                        <h1>{this.props.test.name}</h1>
                        {this.state.questions.map(question => (
                            <div className="question content">
                                {++questionIndex}. {question.text}<br/>
                                {this.state.possibleAnswers.filter(answer => answer.questionId === question.id)
                                    .map(answer => (
                                        <div>
                                            {question.type == 2 ? <input data-question-id={question.id}
                                                data-answer-id={answer.id} className="studentAnswer"
                                                type="radio" name={questionIndex} /> :
                                            question.type == 3 ? <input data-question-id={question.id}
                                                data-answer-id={answer.id} className="studentAnswer" type="checkbox" />
                                            : null} {answer.text}
                                        </div>
                                    )
                                )}
                                {question.type == 1 ?
                                    <input data-question-id={question.id} className="studentAnswer content"/> : null}
                            </div>
                        ))}
                        <button onClick={this.submitTest}>Отправить</button>
                   </div>
            );
        }
    }

    componentDidMount() {
        fetch("http://localhost:8080/get-questions?testId=" + this.props.test.id,
        {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(questionsArray => {
            fetch("http://localhost:8080/get-possible-answers?testId=" + this.props.test.id,
            {
                credentials: 'include'
            })
            .then(response => response.json())
            .then(possibleAnswersArray => {
                this.setState({
                    questions: questionsArray,
                    possibleAnswers: possibleAnswersArray
                });
            });
        });

        if(getCookieValue("role") === "STUDENT") {
            fetch("http://localhost:8080/get-student-answers?testId=" + this.props.test.id,
            {
                credentials: 'include'
            })
            .then(response => {
                if(response.status === 404) {
                    throw new Error("no submission");
                } else {
                    return response.json();
                }
            })
            .then(studentTestResponseDto => {
                fetch("http://localhost:8080/view-correct-answers?testId=" + this.props.test.id,
                {
                    credentials: 'include'
                })
                .then(response => {
                    if(!response.ok) {
                        throw new Error();
                    } else {
                        return response.json();
                    }
                })
                .then(correctAnswers => {
                    console.log("correct ", correctAnswers);
                    this.setState({
                        correctAnswers: correctAnswers,
                        studentAnswers: studentTestResponseDto,
                        submitted: true
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
}