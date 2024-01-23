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
    FOREIGN KEY (Author_ID) REFERENCES Authors (Author_ID) ON DELETE CASCADE
);

-- Create the BookCopies table
CREATE TABLE BookCopies (
    Copy_ID SERIAL PRIMARY KEY,
    Book_ID INT NOT NULL,
    Status VARCHAR(20) DEFAULT 'available' CHECK (Status IN ('available', 'not available')) NOT NULL,
    FOREIGN KEY (Book_ID) REFERENCES Books (Book_ID) ON DELETE CASCADE
);

-- Create the Borrowers table
CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(255) NOT NULL,
    Last_Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Registered_Date DATE DEFAULT CURRENT_DATE NOT NULL
);

-- Create the BorrowedBooks table
CREATE TABLE BorrowedBooks (
    BorrowedBook_ID SERIAL PRIMARY KEY,
    Copy_ID INT NOT NULL,
    User_ID INT NOT NULL,
    Checkout_Date DATE DEFAULT CURRENT_DATE NOT NULL,
    Due_Date DATE NOT NULL,
    Return_Date DATE,
    FOREIGN KEY (Copy_ID) REFERENCES BookCopies (Copy_ID) ON DELETE CASCADE,
    FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE
);
