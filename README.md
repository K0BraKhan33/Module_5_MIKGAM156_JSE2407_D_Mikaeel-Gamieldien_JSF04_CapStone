# Module_5_MIKGAM156_JSE2407_D_Mikaeel-Gamieldien_JSF04_FinalProject
# Vue Project

## Project Overview

This is an extention of my module 4 Project, ive added a comparason table, cart, themechange and discounted produtcs. 

## Link to video

## Link to websight
- you will need to login to a github account
```webview
https://module-5-mikgam-156-jse-2407-d-mikaeel-gamieldien-7tnqxr6fg.vercel.app/
```



## Installation

## ProjectHelp
- all code has been either tweeked or changed, help rom open saurce users was used to fix problems, all code was done by me. cope stratagies might of been used from other projects but all interagtions were done by me.


To get started with this project, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/K0BraKhan33/Module_5_MIKGAM156_JSE2407_D_Mikaeel-Gamieldien_JSF04_CapStone.git
    cd my-vue-app
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

3. **Start the development server:**

    ```bash
    npm run dev
    ```

4. **Open the application in your browser:**

    Navigate to `http://localhost:5173` to view the application.

## Usage

### Product List

- The `ProductList.vue` component displays a list of products fetched from an API. 
- Products can be sorted by price or title and filtered by category using the `SortControls.vue` component.

### Product Detail

- The `ProductDetail.vue` component shows detailed information about a single product when selected from the product list.

### Sorting and Filtering

- The `SortControls.vue` component allows users to sort products by price or title and filter by category. It also includes a reset button to clear filters.

### ProductDicount
- The `ProductDicount.vue` component allows the user to preveiw 5 products that are dicounted, this is set for all that log in

### comapason tabel
- The `ProductCompare.vue` compnent allows the user to compare products with ease, allows them to add and remove products allowing the user to see all the products they want in one neat location
### Theme
-the theme component in each file allows the page to look sleak clean and able to change quickly, it auto seletcs the users input as default for the browser.

## API Integration

The project uses the following API endpoint to fetch product data:

- **API Endpoint:** `https://fakestoreapi.com/products`

## Components

### Filters.vue

Handles the filtering and sorting of products.

### ProductDetail.vue

Displays detailed information about a selected product.

### ProductList.vue

Shows a list of products and integrates with `SortControls.vue` for sorting and filtering.

### SortControls.vue

Provides sorting and filtering options for products. Includes reset functionality.

## Tailwind CSS

The project uses Tailwind CSS for styling. Ensure Tailwind CSS is installed and configured by following the setup instructions in the `tailwind.config.js` file.

## Vue Router

Vue Router is used for routing between `ProductList` and `ProductDetail` components. Ensure Vue Router is configured in `main.js`.

## Development

For development purposes, you can use the following commands:

- **Run Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
-**preview production build:** `npm run preview`
- **Run Tests:** `npm test`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Please do not push to this file unless you have contributed to this project
