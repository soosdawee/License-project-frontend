context("Account creation and personal information handling", () => {
    let testEmail;
    let testPassword;
    let testTitle;
    let testArticle;
    let testSheetsLink;
    let testSheetsFilterLink;

     before(() => {
        testEmail = "test@user.com";
        testPassword = "string";
        testTitle = "Custom title";
        testArticle = "Really interesting short-form content!"
        testSheetsFilterLink = "https://docs.google.com/spreadsheets/d/1ZLpcRHk6GmrC4CLLOO5mwkt2-KHJ4OSdMaliGZ8lZfE/edit?usp=sharing"
        testSheetsLink = "https://docs.google.com/spreadsheets/d/1ZotLJL16MHKrHBxTLUIsb4O0uTLF-xzKOdmNYl8SGbw/edit?usp=sharing"
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

     describe("Create visualizations", () => {
        const data = ["Alma{enter}Korte{enter}Kave", "2{enter}5{enter}10", "apple{enter}pear{enter}cuki"]
        it("can create a Bar Chart", () => {
            cy.get('[name="visualization-0"]').should("be.visible").click();
            cy.get('.handsontable').should('exist');
            for (let i = 1; i <= 3; i++) {
                const j = 1 + i;
                cy.get(`.handsontable tbody > :nth-child(1) > :nth-child(${j})`).click().click().get('.handsontableInput:visible').type(data[i-1]);
            }
            cy.get('.handsontable .htCore tbody tr').eq(0).find('td').eq(0).should('contain', 'Alma');

            cy.get('[name="stage-2"]').should('be.visible').click();

            cy.contains("div", "Header").click();
            cy.get('input[name="title"]').as("ti");
            cy.get("@ti").type(testTitle);
            cy.get("@ti").should("have.value", testTitle);
            cy.get('input[name="article"]').as("ar");
            cy.get("@ar").type(testArticle);
            cy.get("@ar").should("have.value", testArticle);
            cy.get('input[name="title-font"]').as("ts");
            cy.get("@ts").clear().type(30);
            cy.get("@ts").should("have.value", 30);
            cy.get('input[name="article-font"]').as("as");
            cy.get("@as").clear().type(12);
            cy.get("@as").should("have.value", 12);

            cy.contains("div", "Text").click();
            cy.get('[data-testid="text-color-input"]')
                .should('exist').clear()
                .type('#808080');
            cy.get('div.MuiSelect-select').first().click();
            cy.get('ul.MuiList-root li')
            .eq(1)
            .click();

            cy.contains("div", "Background").click();
            cy.get('[data-testid="background-input"]')
                .should('exist').clear()
                .type('#f7c76a');

            cy.contains("div", "Bar Appearance").click();
            cy.get('[data-testid="bar-color-input"]')
                .should('exist').clear()
                .type('#0b594f');
            cy.get('input[name="color-overrides"]').should('exist').clear().type("Korte: #ffffff")
            cy.get('input[name="bar-opacity"]').should('exist').clear().type(50)
            cy.get('input[name="bar-spacing"]').should('exist').clear().type(50)

            cy.contains("div", "Annotations").click();
            cy.get('input[name="show-annotations"]').check({ force: true });
            cy.get('input[name="annotation-format"]').should('exist').clear().type('special format')

            cy.contains("div", "Axes & Grids").click();
            cy.get('input[name="x-axis"]').should('exist').clear().type("X-Axis")
            cy.get('input[name="y-axis"]').should('exist').clear().type("Y-Axis")
            cy.get('input[name="labels-visible"]').check({ force: true });
            cy.get('input[name="show-grids"]').check({ force: true });

            cy.get('[name="stage-3"]').should('be.visible').click();
            cy.get('[name="save-button"]').should('be.visible').click();
        })

        it("can create a Pie Chart", () => {
            cy.get('[name="visualization-1"]').should("be.visible").click();
            cy.get('.handsontable').should('exist');
            for (let i = 1; i <= 3; i++) {
                const j = 1 + i;
                cy.get(`.handsontable tbody > :nth-child(1) > :nth-child(${j})`).click().click().get('.handsontableInput:visible').type(data[i-1]);
            }
            cy.get('.handsontable .htCore tbody tr').eq(0).find('td').eq(0).should('contain', 'Alma');

            cy.get('[name="stage-2"]').should('be.visible').click();

            cy.contains("div", "Header").click();
            cy.get('input[name="title"]').as("ti");
            cy.get("@ti").type(testTitle);
            cy.get("@ti").should("have.value", testTitle);
            cy.get('input[name="article"]').as("ar");
            cy.get("@ar").type(testArticle);
            cy.get("@ar").should("have.value", testArticle);
            cy.get('input[name="title-font"]').as("ts");
            cy.get("@ts").clear().type(30);
            cy.get("@ts").should("have.value", 30);
            cy.get('input[name="article-font"]').as("as");
            cy.get("@as").clear().type(12);
            cy.get("@as").should("have.value", 12);

            cy.contains("div", "Text").click();
            cy.get('[data-testid="text-color-input"]')
                .should('exist').clear()
                .type('#808080');
            cy.get('div.MuiSelect-select').first().click();
            cy.get('ul.MuiList-root li')
            .eq(1)
            .click();

            cy.contains("div", "Background").click();
            cy.get('[data-testid="background-input"]')
                .should('exist').clear()
                .type('#f7c76a');

            cy.contains("div", "Pie Appearance").click();
            cy.get('[data-testid="color-palette-select"]').click();
            cy.get('[role="listbox"] [role="option"]').eq(1).click();   

            cy.get('input[name="color-overrides"]').should('exist').clear().type("Alma: #000000")

            cy.contains("div", "Annotations").click();
            cy.get('input[name="show-annotations"]').check({ force: true });
            cy.get('input[name="annotation-format"]').should('exist').clear().type('special format')

            cy.get('[name="stage-3"]').should('be.visible').click();
            cy.get('[name="save-button"]').should('be.visible').click();
        })
	it("can create a Filter Map", () => {
            cy.get('[name="visualization-10"]').should("be.visible").click();
            cy.get('[name="google-sheets"]').click();
            cy.get('[name="sheets-link"]').type(testSheetsFilterLink);
            cy.get('[name="load-data"]').click();
            cy.get('[name="stage-2"]').should('be.visible').click();

            cy.contains("div", "Header").click();
            cy.get('input[name="title"]').as("ti");
            cy.get("@ti").type(testTitle);
            cy.get("@ti").should("have.value", testTitle);
            cy.get('input[name="article"]').as("ar");
            cy.get("@ar").type(testArticle);
            cy.get("@ar").should("have.value", testArticle);
            cy.get('input[name="title-font"]').as("ts");
            cy.get("@ts").clear().type(30);
            cy.get("@ts").should("have.value", 30);
            cy.get('input[name="article-font"]').as("as");
            cy.get("@as").clear().type(12);
            cy.get("@as").should("have.value", 12);

            cy.contains("div", "Text").click();
            cy.get('[data-testid="text-color-input"]')
                .should('exist').clear()
                .type('#808080');
            cy.get('div.MuiSelect-select').first().click();
            cy.get('ul.MuiList-root li')
            .eq(1)
            .click();

            cy.contains("div", "Background").click();
            cy.get('[data-testid="background-input"]')
                .should('exist').clear()
                .type('#f7c76a');

            cy.contains("div", "Appearance").click();
            cy.get('[data-testid="color-palette-select"]').click();
            cy.get('[role="listbox"] [role="option"]').eq(1).click(); 

            cy.contains("div", "Annotations").click();
            cy.get('input[name="show-annotations"]').check({ force: true });
            cy.get('input[name="annotation-format"]').should('exist').clear().type('special format')

            cy.get('[name="stage-3"]').should('be.visible').click();
            cy.get('[name="save-button"]').should('be.visible').click();
        })
	    it("can create a Bubble Map", () => {
            cy.get('[name="visualization-15"]').should("be.visible").click();
            cy.get('[name="google-sheets"]').click();
            cy.get('[name="sheets-link"]').type(testSheetsLink);
            cy.get('[name="load-data"]').click();
            cy.get('[name="stage-2"]').should('be.visible').click();

            cy.contains("div", "Header").click();
            cy.get('input[name="title"]').as("ti");
            cy.get("@ti").type(testTitle);
            cy.get("@ti").should("have.value", testTitle);
            cy.get('input[name="article"]').as("ar");
            cy.get("@ar").type(testArticle);
            cy.get("@ar").should("have.value", testArticle);
            cy.get('input[name="title-font"]').as("ts");
            cy.get("@ts").clear().type(30);
            cy.get("@ts").should("have.value", 30);
            cy.get('input[name="article-font"]').as("as");
            cy.get("@as").clear().type(12);
            cy.get("@as").should("have.value", 12);

            cy.contains("div", "Text").click();
            cy.get('[data-testid="text-color-input"]')
                .should('exist').clear()
                .type('#808080');
            cy.get('div.MuiSelect-select').first().click();
            cy.get('ul.MuiList-root li')
            .eq(1)
            .click();

            cy.contains("div", "Background").click();
            cy.get('[data-testid="background-input"]')
                .should('exist').clear()
                .type('#f7c76a');

            cy.contains("div", "Annotations").click();
            cy.get('input[name="show-annotations"]').check({ force: true });
            cy.get('input[name="annotation-format"]').should('exist').clear().type('special format')

            cy.get('[name="stage-3"]').should('be.visible').click();
            cy.get('[name="save-button"]').should('be.visible').click();
	    })
        

        it("can delete visualization", () => {
            cy.get('[name="more-button"]').should("be.visible").click()
            cy.get('[name="my-visualizations"]').should("be.visible").click()
            cy.contains('My Visualizations').should('be.visible');

            cy.get(`[name="visualization-0"]`).realHover();
            
            cy.get(`[name="visualization-0"]`)
            .parent()
            .find('[name="delete-button"]')
            .should('be.visible')
            .click();
        })
    })
})