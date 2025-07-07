// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// cypress/support/commands.js
// cypress/support/commands.js

import "cypress-real-events/support";

Cypress.Commands.add('mockWebSocketForComments', () => {
    cy.window().then((win) => {
        // Mock SockJS constructor
        win.SockJS = class MockSockJS {
            constructor(url) {
                this.url = url;
                this.readyState = 1; // OPEN
                this.onopen = null;
                this.onclose = null;
                this.onmessage = null;
                this.onerror = null;
                
                setTimeout(() => {
                    if (this.onopen) this.onopen();
                }, 100);
            }
            
            send(data) {
                console.log('Mock SockJS send:', data);
            }
            
            close() {
                this.readyState = 3; // CLOSED
                if (this.onclose) this.onclose();
            }
        };

        // Mock the STOMP Client constructor
        const MockClient = class {
            constructor(config) {
                this.config = config;
                this.connected = false;
                this.subscriptions = new Map();
                
                // Store stubs for verification
                this.publishStub = cy.stub().as('stompPublish');
                this.subscribeStub = cy.stub().as('stompSubscribe');
                this.activateStub = cy.stub().as('stompActivate');
                this.deactivateStub = cy.stub().as('stompDeactivate');
            }
            
            activate() {
                this.connected = true;
                this.activateStub();
                
                // Simulate successful connection
                setTimeout(() => {
                    if (this.config.onConnect) {
                        this.config.onConnect();
                    }
                }, 100);
            }
            
            deactivate() {
                this.connected = false;
                this.deactivateStub();
                this.subscriptions.clear();
            }
            
            subscribe(destination, callback) {
                this.subscribeStub(destination, callback);
                
                // Store subscription for potential testing
                this.subscriptions.set(destination, callback);
                
                // Return mock subscription object
                return {
                    unsubscribe: () => {
                        this.subscriptions.delete(destination);
                    }
                };
            }
            
            publish(params) {
                this.publishStub(params);
                console.log('Mock STOMP publish:', params);
            }
            
            // Method to simulate receiving messages (useful for testing)
            simulateMessage(destination, body) {
                const callback = this.subscriptions.get(destination);
                if (callback) {
                    callback({ body: JSON.stringify(body) });
                }
            }
        };

        // Replace the actual Client class
        if (win.StompJs) {
            win.StompJs.Client = MockClient;
        }
        
        // Also handle direct imports
        win.Client = MockClient;
    });
});

// Additional command to simulate WebSocket messages
Cypress.Commands.add('simulateCommentMessage', (visualizationId, comment) => {
    cy.window().then((win) => {
        // Find the mock client instance and simulate a message
        const mockClient = win.mockStompClient;
        if (mockClient) {
            mockClient.simulateMessage(`/topic/comments/${visualizationId}`, comment);
        }
    });
});

Cypress.Commands.add('simulateTypingMessage', (visualizationId, username) => {
    cy.window().then((win) => {
        const mockClient = win.mockStompClient;
        if (mockClient) {
            mockClient.simulateMessage(`/topic/comments/${visualizationId}/typing`, username);
        }
    });
});