context("Account creation and personal information handling", () => {
  function getRandomFirstName() {
    const names = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah"];
    return names[Math.floor(Math.random() * names.length)];
    }

    function getRandomLastName() {
    const names = ["Smith", "Sprencz", "Szabo", "Renyi", "Groza", "Antal", "Alma", "Szentkuti"];
    return names[Math.floor(Math.random() * names.length)];
    }

    function getRandomDescription() {
    const names = ["Live.Laugh.Love.", "You can do it!", "Inspired by visualizations", "[Bible verse]", "There is no visualization without data!", "There is no data without visualization"];
    return names[Math.floor(Math.random() * names.length)];
    }

  let testEmail;
  let testPassword;
  let testFirstname;
  let testLastname;
  let testDescription;
  let testNewPassword;

  function performLogin() {
      cy.contains('button', "Start Creating").click();

      cy.get('input[name="email"]').as("em");
      cy.get("@em").type(testEmail);
      cy.get("@em").should("have.value", testEmail);
      cy.get('input[name="password"]').as("pw");
      cy.get("@pw").type(testPassword);
      cy.get("@pw").should("have.value", testPassword);

      cy.contains("button", "Login").should("be.visible").click();

      cy.get('[name="charts-page"]').should("be.visible");
    }

    function performLoginWithNewPassword() {
      cy.contains('button', "Start Creating").click();

      cy.get('input[name="email"]').as("em");
      cy.get("@em").type(testEmail);
      cy.get("@em").should("have.value", testEmail);
      cy.get('input[name="password"]').as("pw");
      cy.get("@pw").type(testNewPassword);
      cy.get("@pw").should("have.value", testNewPassword);

      cy.contains("button", "Login").should("be.visible").click();

      cy.get('[name="charts-page"]').should("be.visible");
    }

  before(() => {
    const uniqueEmailTag = Math.floor(Math.random() * 10000000);
    testEmail = "test_email" + uniqueEmailTag + "@gmail.com";
    testPassword = "string";
    testFirstname = getRandomFirstName();
    testLastname = getRandomLastName();
    testDescription = getRandomDescription();
    testNewPassword = "not string";
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("http://localhost:3000");
  });

  it("can load application", () => {
    cy.contains('button', "Start Creating").should("be.visible");
  });

  describe("Successful registration", () => {
    it("can reach the Register page", () => {
      cy.contains('button', "Start Creating").click();
      cy.contains('Register').click();
    })

    it("can fill in form", () => {
      cy.contains('button', "Start Creating").click();
      cy.contains('Register').click();

      cy.get('input[name="firstname"]').as("fn");
      cy.get("@fn").type("Johny");
      cy.get("@fn").should("have.value", "Johny");
      cy.get('input[name="lastname"]').as("ln");
      cy.get("@ln").type("Test");
      cy.get("@ln").should("have.value", "Test");
      cy.get('input[name="email"]').as("em");
      cy.get("@em").type(testEmail);
      cy.get("@em").should("have.value", testEmail);
      cy.get('input[name="password"]').as("pw");
      cy.get("@pw").type("string");
      cy.get("@pw").should("have.value", "string");

      cy.contains("button", "Register").should("be.visible").click();

      cy.get('[name="login-form"]').should("be.visible");
    })
  })

  describe("Successful sign in", () => {
    it("can reach the Login page", () => {
      cy.contains('button', "Start Creating").click();
    })

    it("can fill in form", () => {
      cy.contains('button', "Start Creating").click();

      cy.get('input[name="email"]').as("em");
      cy.get("@em").type(testEmail);
      cy.get("@em").should("have.value", testEmail);
      cy.get('input[name="password"]').as("pw");
      cy.get("@pw").type("string");
      cy.get("@pw").should("have.value", "string");

      cy.contains("button", "Login").should("be.visible").click();

      cy.get('[name="charts-page"]').should("be.visible");
    });
  });

  describe("Change personal information", () => {
    it("can reach Settings page", () => {
        performLogin()
        cy.get('[name="more-button"]').should("be.visible").click();
        cy.get('[name="settings"]').should("be.visible").click();
    });   

    it("can modify first name", () => {
       performLogin()
        cy.get('[name="more-button"]').should("be.visible").click();
        cy.get('[name="settings"]').should("be.visible").click();

        cy.get('[name="change-button"]').should("be.visible").click();

        cy.get('input[name="firstname"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testFirstname)
            .should('have.value', testFirstname);

        cy.get('[name="change-button"]').should("be.visible").click();

        cy.get('input[name="firstname"]').should('have.value', testFirstname);
    });

    it("can modify last name", () => {
        performLogin()
        cy.get('[name="more-button"]').should("be.visible").click();
        cy.get('[name="settings"]').should("be.visible").click();

        cy.get('[name="change-button"]').should("be.visible").click();

        cy.get('input[name="lastname"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testLastname)
            .should('have.value', testLastname);

        cy.get('[name="change-button"]').should("be.visible").click();
        
        cy.get('input[name="lastname"]').should('have.value', testLastname);
    });

    it("can modify description", () => {
        performLogin()
        cy.get('[name="more-button"]').should("be.visible").click();
        cy.get('[name="settings"]').should("be.visible").click();

        cy.get('[name="change-button"]').should("be.visible").click();

        cy.get('input[name="description"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testDescription)
            .should('have.value', testDescription);

        cy.get('[name="change-button"]').should("be.visible").click();
        
        cy.get('input[name="description"]').should('have.value', testDescription);
    });

    it("can modify password", () => {
        performLogin()
        cy.get('[name="more-button"]').should("be.visible").click();
        cy.get('[name="settings"]').should("be.visible").click();

        cy.get('[name="change-password"]').should("be.visible").click();

        cy.get('input[name="old-password"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testPassword)
            .should('have.value', testPassword);

        cy.get('input[name="new-password"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testNewPassword)
            .should('have.value', testNewPassword);
        
        cy.get('input[name="confirm-password"]')
            .should('be.visible')
            .and('not.be.disabled')
            .clear()
            .type(testNewPassword)
            .should('have.value', testNewPassword);

        cy.get('[name="change-password"]').should("be.visible").click();
    });
  }); 

  describe("Delete account", () => {
   it("can delete account", () => {
      performLoginWithNewPassword()
      cy.get('[name="more-button"]').should("be.visible").click();
      cy.get('[name="settings"]').should("be.visible").click();

      cy.get('[name="delete-button"]').should("be.visible").click();

      cy.contains('button', "Start Creating").should("be.visible");
   });
  });
});