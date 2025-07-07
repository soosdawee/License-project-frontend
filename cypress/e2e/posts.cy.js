context("Liking and commenting on a post", () => {
    let testEmail;
    let testPassword;
    let testComment;

    before(() => {
        testEmail = "test@user.com";
        testPassword = "string";
        testComment = "This is a comment!";
    });

    beforeEach(() => {
        cy.viewport(1920, 1080);
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
    });

    describe("Testing out social features", () => {
        it("can reach Social page", () => {
            cy.get('[name="social-button"]').should("be.visible").click();
        });   

        it("can like a post", () => {
            cy.get('[name="social-button"]').should("be.visible").click();

            cy.get('[name="like-0"]').should("be.visible").click();
        });

        it("view comment section", () => {
            cy.get('[name="social-button"]').should("be.visible").click();
            cy.get('[name="comment-0"]').should("be.visible").click();
            cy.get('[name="comment-modal"]').should("be.visible");
        }); 
    });
});