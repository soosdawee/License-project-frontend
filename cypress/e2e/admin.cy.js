context("Admin functionalities", () => {
    let testEmail;
    let testPassword;

    before(() => {
        testEmail = "test@user.com";
        testPassword = "string";
    });

    beforeEach(() => {
        cy.viewport(1275, 730);
        cy.visit("http://localhost:3000");

        cy.contains('button', "Start Creating").click();

        cy.get('input[name="email"]').as("em");
        cy.get("@em").type(testEmail);
        cy.get("@em").should("have.value", testEmail);
        cy.get('input[name="password"]').as("pw");
        cy.get("@pw").type(testPassword);
        cy.get("@pw").should("have.value", testPassword);

        cy.contains("button", "Login").should("be.visible").click();

        cy.get('[name="charts-page"]').should("be.visible");

        cy.get('[name="admin-dashboard"]').should("be.visible").click()
    });

    describe("Visualization models", () => {
        it("Create, modify and delete a visualization model", () => {
            const originalName = "Test Model";
            const updatedName = "Updated Model";    
            cy.get('[name="model-name"]').type(originalName);
            cy.get('[name="column-names"]').type("Name,Has Volcano,Population");
            const fileName = "mozgelogo.svg"; 
            cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, {
                force: true,
            });
            cy.get('[name="upload-model"]').click();

            cy.get('[name="edit-button-18"]').click();
            cy.get('[name="model-18"]').clear().type(updatedName);
            cy.get('[name="save-button-18"]').click();

            cy.get('[name="delete-button-18"]').click();
        })
    });

    describe("Users", () => {
        it("Search and delete user", () => {
            const testName = "Johny";
            cy.get('[name="users-button"]').click();
            cy.get('[name="search-bar"]').type(testName, { force: true });

            cy.get(`[name="card-0"]`).realHover();
            cy.get(`[name="user-delete-0"]`).click();
        })
    });
})