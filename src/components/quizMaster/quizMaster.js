import { LightningElement, track } from 'lwc';

export default class QuizMaster extends LightningElement {

    // quiz questions
    questions = [
        {
            question: 'What does LWC stand for?',
            options: ['Lightning Web Components', 'Light Web Control', 'Live Web Class', 'Logic Web Component'],
            answer: 0
        },
        {
            question: 'Which decorator is used for reactivity?',
            options: ['@api', '@track', '@wire', '@reactive'],
            answer: 1
        },
        {
            question: 'Which file contains HTML in LWC?',
            options: ['.js', '.css', '.html', '.xml'],
            answer: 2
        }
    ];

    // variables
    @track currentQuestion = 0;
    @track selectedOption = null;
    @track score = 0;
    @track isAnswered = false;
    @track isQuizActive = true;
    @track isResultsActive = false;

    startTime = Date.now();

    // get current question
    get question() {
        return this.questions[this.currentQuestion];
    }

    get totalQuestions() {
        return this.questions.length;
    }

    get progressStyle() {
        let percent = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        return `width: ${percent}%;`;
    }

    get accuracy() {
        return Math.round((this.score / this.totalQuestions) * 100);
    }

    get timeTaken() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    get resultMessage() {
        if (this.accuracy === 100) {
            return 'Excellent!';
        } else if (this.accuracy >= 60) {
            return 'Good job!';
        } else {
            return 'Need more practice!';
        }
    }

    // when user clicks an option
    handleSelectOption(event) {
        if (this.isAnswered) {
            return;
        }

        let selectedIndex = event.target.dataset.optionIndex;
        this.selectedOption = selectedIndex;
        this.isAnswered = true;

        if (Number(selectedIndex) === this.question.answer) {
            this.score++;
        }
    }

    handleNext() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            this.resetQuestion();
        } else {
            this.finishQuiz();
        }
    }

    handlePrevious() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.resetQuestion();
        }
    }

    handleRestartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedOption = null;
        this.isAnswered = false;
        this.isQuizActive = true;
        this.isResultsActive = false;
        this.startTime = Date.now();
    }

    resetQuestion() {
        this.selectedOption = null;
        this.isAnswered = false;
    }

    finishQuiz() {
        this.isQuizActive = false;
        this.isResultsActive = true;
    }

    getOptionButtonClass(index) {
        if (!this.isAnswered) {
            return 'option-btn';
        }

        if (index == this.question.answer) {
            return 'option-btn correct';
        }

        if (index == this.selectedOption) {
            return 'option-btn wrong';
        }

        return 'option-btn';
    }
}
