# Project Report - Milestone 1: Online Store Mockups

## Group Identification

- **Group:** 8
- **Students:**
  - **Student 1:** Douglas da Fontoura Pereyra (USP number: 14566686)
  - **Student 2:** Henrique Vilela Zucoloto (USP number: 14578515)
  - **Student 3:** Nicolas Carreiro Rodrigues (USP number: 14600801)

---

## Requirements

### General Requirements:
- The system must have two types of users: **Clients** and **Administrators**.
- **Administrators** manage the store, including registering other administrators, customers, and products.
- **Customers** can buy products or services, managing their shopping cart and making payments.
- The store may sell **products, services, or both**.
- Administrators can create/update/read/delete (CRUD) products and services.
- The system must support the following functionalities:
  - **User Management:** Registration of administrators and customers.
  - **Product/Service Management:** CRUD operations for products and services.
  - **Shopping Cart:** Allows customers to add items and make payments.
  - **Order Management:** Process the orders and update inventory.

### Additional Requirements for Our Implementation:
- Our store will sell **products** only (for simplicity).
- The customer can view, add to cart, and purchase products.
- We will implement a **search bar** for easy product discovery.
- The **checkout page** allows customers to enter payment details and complete the purchase.

---

## Project Description

This project implements a mock-up for an **Online Supermarket, Carrethree**. The mock-up is designed both for the **client-side** and **admin-side** interfaces using **HTML5** and **CSS3**.

### Main Screens:
1. **Customer Home Page:**
   - Displays supermarket products organized by categories (fruits, vegetables, dairy, etc.)
   - Features store's **logo**, **navigation menu**, and **search bar**
   - Includes quick access to popular items
   - Navigation to **Login**, **Cart**, and **My Account**
   
2. **Admin Dashboard:**
   - CRUD interface for product management
   - Inventory status overview
   
3. **Login Page:**
   - Unique login forms for customers and admins
   - Registration option for new customers

4. **Product Details Page:**
   - Shows detailed information about a product, including **description**, **price**, **images**, and the option to **add to cart**.

5. **Product Details (admin)**
    - - CRUD interface for product management
   
6. **Shopping Cart Page:**
   - Displays products added to the cart, allows customers to modify quantities, and includes a **Checkout** button.
   
7. **Checkout Page:**
   - Collects **shipping address**, **payment details**, and shows the total price.

### Mockups:
- Mock-ups for the above screens were created using **HTML5** and **CSS3**. Below are the mock-up pages:
  - **Customer Home**: 
  ![customer home](img/customerhome.jpg)
  - **Admin Dashboard**: 
  ![adm dashboard](img/admdash.jpg)
  - **Login Page**: 
  ![login](img/login.jpg)
  - **Product Details Page**: 
  ![product page](img/pdpage.jpg)
  - **Product Details (admin)**: 
  ![product page admin](img/pdadm.jpg)
  - **Shopping Cart**: 
  ![cart](img/cart.jpg)
  - **Checkout**: 
  ![checkout](img/checkout.jpg)

These mock-ups serve as static snapshots of the application, illustrating the layout and user interface elements. The design follows the **Single-Page Application** style.

---

### Navigation Diagram

- for the navigation diagram we used the figma tool, below is the link to the diagram:
[navigation diagram](https://www.figma.com/design/CtUhpCMJ491GAEWOQcpVr3/Untitled?node-id=0-1&t=XjS0xpalAkzbz15Z-1)

**How to use the diagram:**
- click on play in the top right corner
- on each screen, the buttons that lead to the other screens are clickable and show the corresponding mockup.

**Written diagram:**
- user home -> login
- user home -> user product detail
- user home -> cart

- adm home -> adm product detail
- adm home -> cart
- adm home -> login

- product detail -> cart
- product detail -> login
- product detail -> home

- adm product detail -> cart
- adm product detail -> login
- adm product detail -> adm home

- cart -> payment
- cart -> home
- cart -> login

- login
- payment

## Comments About the Code

- *HTML5* is used for structuring the page content, and *CSS3* is used for styling and layout management.
- The *login/signup forms* are interactive, and CSS transitions are used for smooth page transitions.
- Flexbox is used for most of the page layout to easily align and distribute elements within containers. Only the product listing section uses CSS Grid to better organize multiple items responsively in rows and columns.
- SVG icons are used instead of image files because they are scalable without losing quality, lightweight for faster loading, and easily customizable with CSS (like changing colors or size dynamically).
- Placeholder content is used in the mock-ups, but the actual content (products, user data, etc.) will be dynamically generated in the full application.

---

## Test Plan

### Manual Testing:
- Test the responsiveness of the layout on various screen sizes.
- Verify the correct rendering of the navigation bar, forms, and product details.
- Ensure that all form inputs accept valid data and display error messages when necessary.

## Test Results

The mock-up pages have been thoroughly tested, and everything functions as expected. The layout is responsive across various screen sizes, ensuring that the pages adapt well to desktop, tablet, and mobile devices. The navigation bar, forms, and product details render correctly and maintain their proper structure. Form inputs accept valid data and display error messages when necessary, providing clear feedback to users. Overall, the mock-up is fully functional and ready for the next steps in the development process.

---

## Build Procedures

To set up the project and run the mock-ups:

1. **Install necessary software:**
   - Text editor (e.g., Visual Studio Code, Sublime Text).
   - Web browser (e.g., Google Chrome, Firefox).

2. **Clone the repository:**
   - Clone the project repository from GitHub:
     ```bash
     git clone https://github.com/douglas-pereyra/OnlineStore.git
     ```

3. **Open the project:**
   - Open the `index.html` file in a web browser to view the homepage.
   - Navigate through the pages as needed.

---

## Problems

- The initial design had some issues with **layout responsiveness** on smaller screens, which were fixed using media queries in the CSS.
- Some placeholder images were missing in the mock-up for the product listings, which were later added.

---

## Comments

- This mock-up serves as the foundational design for the Online Store application.
- Future milestones will focus on implementing dynamic functionality such as **user authentication**, **product management**, and **cart management**.
- Collaboration within the group worked smoothly, but we plan to divide tasks more effectively in the next phases.
