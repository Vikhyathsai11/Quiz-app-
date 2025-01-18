// cypress/e2e/startPage.cy.ts
describe('Start Page Functionality', () => {
    beforeEach(() => {
      // Visit the StartPage before each test
      cy.visit('/');
    });
  
    it('should render the start page correctly', () => {
      // Step 1: Verify the header, input field, and button are visible
      cy.contains('h1', 'Welcome to the Quiz').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.contains('button', 'Start Quiz').should('be.visible');
    });
  
    it('should show an error for invalid email', () => {
      // Step 1: Enter an invalid email and click the "Start Quiz" button
      cy.get('input[type="email"]').type('invalid-email');
      cy.contains('button', 'Start Quiz').click();
      cy.wait(500); // Wait for error message to appear
  
      // Step 2: Verify the error message is displayed
      cy.contains('Please enter a valid email address').should('be.visible');
    });
  
    it('should not show an error for valid email and redirect to /quiz', () => {
      // Step 1: Enter a valid email address
      cy.get('input[type="email"]').type('test@example.com');
      cy.wait(500); // Short delay for any UI updates
  
      // Step 2: Click the "Start Quiz" button
      cy.contains('button', 'Start Quiz').click();
      cy.wait(1000); // Wait for redirection
  
      // Step 3: Verify redirection to the quiz page and email in localStorage
      cy.url().should('include', '/quiz');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userEmail')).to.equal('test@example.com');
      });
    });
  
    it('should clear the error message when input changes', () => {
      // Step 1: Enter an invalid email and click the "Start Quiz" button
      cy.get('input[type="email"]').type('invalid-email');
      cy.contains('button', 'Start Quiz').click();
      cy.wait(500); // Wait for error message to appear
  
      // Step 2: Verify the error message is displayed
      cy.contains('Please enter a valid email address').should('be.visible');
  
      // Step 3: Change the email input and verify the error message is removed
      cy.get('input[type="email"]').clear().type('test@example.com');
      cy.wait(500); // Wait for UI updates
      cy.contains('Please enter a valid email address').should('not.exist');
    });
  });
  
  describe('Quiz Page Functionality', () => {
    beforeEach(() => {
      // Simulate login by setting userEmail in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('userEmail', 'test@example.com');
      });
  
      // Visit the Quiz page
      cy.visit('/quiz');
    });
  
    it('should display the loading spinner and then load questions', () => {
      // Step 1: Verify the loading spinner is visible initially
      cy.get('.animate-spin').should('be.visible');
  
      // Step 2: Verify the questions are loaded
      cy.get('.animate-spin').should('not.exist');
      cy.get('h2').should('be.visible');
      cy.contains('Question 1 of').should('be.visible');
    });
  
    it('should allow answering questions and navigating through them', () => {
      // Step 1: Answer the first question
      cy.get('button').contains(/Answer/i).first().click();
  
      // Step 2: Navigate to the next question
      cy.contains('Next').click();
      cy.contains('Question 2 of').should('be.visible');
  
      // Step 3: Navigate back to the previous question
      cy.contains('Previous').click();
      cy.contains('Question 1 of').should('be.visible');
    });
  
    it('should submit the quiz and save results in localStorage', () => {
      // Step 1: Answer all questions
      cy.get('button').contains(/Answer/i).each((button) => {
        cy.wrap(button).click();
        cy.contains('Next').click({ force: true });
      });
  
      // Step 2: Submit the quiz
      cy.contains('Submit Quiz').click();
  
      // Step 3: Verify redirection to the results page
      cy.url().should('include', '/results');
  
      // Step 4: Verify results are saved in localStorage
      cy.window().then((win) => {
        const results = JSON.parse(win.localStorage.getItem('quizResults'));
        expect(results).to.be.an('array');
        expect(results.length).to.be.greaterThan(0);
      });
    });
  
    it('should display timer and navigate to results page on timeout', () => {
      // Step 1: Fast-forward the timer to simulate timeout
      cy.clock();
      cy.tick(30 * 60 * 1000); // Fast-forward 30 minutes
  
      // Step 2: Verify redirection to the results page
      cy.url().should('include', '/results');
    });
  
    it('should allow quick navigation between questions using the overview', () => {
      // Step 1: Click on the question overview button for question 3
      cy.get('button').contains('3').click();
  
      // Step 2: Verify the third question is displayed
      cy.contains('Question 3 of').should('be.visible');
    });
  });
  