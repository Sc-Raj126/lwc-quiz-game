import { LightningElement, track } from 'lwc';

const QUIZ_QUESTIONS = [
  {
    question: 'What does @api decorator do in LWC?',
    options: [
      'Makes a property reactive',
      'Exposes a property to parent components',
      'Defines an event',
      'Marks a method as private'
    ],
    correct: 1
  },
  {
    question: 'What is the @wire decorator used for?',
    options: [
      'Wire components together',
      'Connect to Salesforce data reactively',
      'Define wired properties',
      'All of the above'
    ],
    correct: 1
  },
  {
    question: 'Which lifecycle hook is called when an element is inserted into DOM?',
    options: [
      'renderedCallback()',
      'connectedCallback()',
      'disconnectedCallback()',
      'errorCallback()'
    ],
    correct: 1
  },
  {
    question: 'How do you bind an event in LWC?',
    options: [
      '[click]="handler"',
      'onclick={handler}',
      '@click="handler"',
      '(click)="handler"'
    ],
    correct: 1
  },
  {
    question: 'What is Shadow DOM in LWC?',
    options: [
      'A way to hide elements',
      'DOM encapsulation providing style isolation',
      'A debugging tool',
      'An animation feature'
    ],
    correct: 1
  }
];

export default class QuizMaster extends LightningElement {
  @track currentQuestion = 0;
  @track answers = [];
  @track isQuizActive = true;
  @track isResultsActive = false;
  @track score = 0;
  @track isAnswered = false;
  @track selectedOptionIndex = -1;

  connectedCallback() {
    this.answers = new Array(QUIZ_QUESTIONS.length).fill(-1);
  }

  get totalQuestions() {
    return QUIZ_QUESTIONS.length;
  }

  get question() {
    return QUIZ_QUESTIONS[this.currentQuestion];
  }

  get progressStyle() {
    const percentage = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
    return `width: ${percentage}%`;
  }

  get progressPercentage() {
    return Math.round(((this.currentQuestion + 1) / this.totalQuestions) * 100);
  }

  get scoreCircleStyle() {
    return `background: conic-gradient(#667eea ${(this.score / this.totalQuestions) * 360}deg, #e0e0e0 0deg)`;
  }

  get accuracy() {
    return Math.round((this.score / this.totalQuestions) * 100);
  }

  get resultMessage() {
    if (this.score === this.totalQuestions) {
      return 'Perfect! You are an LWC Master! 🌟';
    } else if (this.score >= 4) {
      return 'Excellent! Strong LWC knowledge! 🁏';
    } else if (this.score >= 3) {
      return 'Good job! Keep learning LWC! 📚';
    } else if (this.score >= 1) {
      return 'Not bad! Review LWC concepts. 🚬';
    }
    return 'Keep practicing LWC fundamentals! 🙋';
  }

  handleOptionClick(event) {
    const button = event.currentTarget;
    const selectedIndex = parseInt(button.dataset.index, 10);
    
    this.selectedOptionIndex = selectedIndex;
    this.answers[this.currentQuestion] = selectedIndex;
    this.isAnswered = true;
  }

  getOptionClass(index) {
    let classes = 'option';
    
    if (this.isAnswered && this.selectedOptionIndex === index) {
      if (this.question.correct === index) {
        classes += ' option--correct';
      } else {
        classes += ' option--incorrect';
      }
    }
    
    if (this.answers[this.currentQuestion] === index) {
      classes += ' option--selected';
    }
    
    return classes;
  }

  isOptionSelected(index) {
    return this.answers[this.currentQuestion] === index;
  }

  getOptionLetter(index) {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  handleNext() {
    if (this.currentQuestion < this.totalQuestions - 1) {
      this.currentQuestion++;
      this.selectedOptionIndex = this.answers[this.currentQuestion];
      this.isAnswered = this.answers[this.currentQuestion] !== -1;
    } else {
      this.finishQuiz();
    }
  }

  handlePrevious() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.selectedOptionIndex = this.answers[this.currentQuestion];
      this.isAnswered = this.answers[this.currentQuestion] !== -1;
    }
  }

  finishQuiz() {
    this.score = this.answers.reduce((total, answer, index) => {
      return total + (answer === QUIZ_QUESTIONS[index].correct ? 1 : 0);
    }, 0);

    this.isQuizActive = false;
    this.isResultsActive = true;
  }

  handleRestart() {
    this.currentQuestion = 0;
    this.answers = new Array(QUIZ_QUESTIONS.length).fill(-1);
    this.score = 0;
    this.selectedOptionIndex = -1;
    this.isAnswered = false;
    this.isQuizActive = true;
    this.isResultsActive = false;
  }
}
