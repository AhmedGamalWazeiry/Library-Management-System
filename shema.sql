-- Create a new database with the new user as the owner
CREATE DATABASE library_db;

-- Connect to the new database
\c library_db

-- Create the Authors table
CREATE TABLE Authors (
    Author_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(255) NOT NULL,
    Last_Name VARCHAR(255) NOT NULL,
    CONSTRAINT unique_author_name UNIQUE (First_Name, Last_Name)
);

-- Create the Books table
CREATE TABLE Books (
    Book_ID SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) UNIQUE NOT NULL,
    Available_Quantity INT NOT NULL,
    Shelf_Location VARCHAR(255) NOT NULL,
    Author_ID INT NOT NULL,
    FOREIGN KEY (Author_ID) REFERENCES Authors (Author_ID)
);

-- Create the Borrowers table
CREATE TABLE Borrowers (
    Borrower_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(255) NOT NULL,
    Last_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Registered_Date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- Create the BorrowedBooks table
CREATE TABLE BorrowedBooks (
    BorrowedBooks_ID SERIAL PRIMARY KEY,
    Book_ID INT NOT NULL,
    Borrower_ID INT NOT NULL,
    Checkout_Date DATE DEFAULT CURRENT_DATE NOT NULL,
    Due_Date DATE NOT NULL,
    Return_Date DATE,
    FOREIGN KEY (Book_ID) REFERENCES Books (Book_ID),
    FOREIGN KEY (Borrower_ID) REFERENCES Borrowers (Borrower_ID)
);
