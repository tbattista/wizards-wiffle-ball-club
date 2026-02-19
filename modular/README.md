# Wizards Wiffle Ball Club - Modular Website

This is the modular version of the Wizards Wiffle Ball Club website, implementing a component-based architecture for improved maintainability, reusability, and development efficiency.

## Project Structure

```
/modular/
├── components/             # HTML components
│   ├── header.html
│   ├── hero.html
│   ├── rsvp.html
│   ├── game-setup.html
│   ├── rules.html
│   ├── field-layout.html
│   ├── location.html
│   └── footer.html
├── data/                   # JSON data files
│   ├── events.json
│   ├── rules.json
│   └── field-info.json
├── templates/              # HTML templates
│   └── base.html
├── assets/
│   ├── css/
│   │   ├── base/           # Base CSS files
│   │   │   ├── variables.css
│   │   │   └── global.css
│   │   ├── components/     # Component-specific CSS
│   │   │   ├── header.css
│   │   │   ├── hero.css
│   │   │   ├── rsvp.css
│   │   │   ├── rules.css
│   │   │   ├── field-layout.css
│   │   │   └── footer.css
│   │   ├── main.css        # Main CSS that imports all modular CSS
│   │   └── custom.css      # Custom overrides
│   ├── js/
│   │   ├── modules/        # JavaScript modules
│   │   │   ├── navigation.js
│   │   │   ├── ui-effects.js
│   │   │   ├── data-loader.js
│   │   │   ├── component-loader.js
│   │   │   └── template-processor.js
│   │   └── main.js         # Main JS entry point
│   ├── img/                # Images (to be populated manually)
│   └── vendor/             # Third-party libraries (to be populated manually)
├── index.html              # Main entry point
├── about.html              # About page
└── README.md               # This file
```

## Key Features

### 1. Component-Based HTML Structure

The website is divided into reusable HTML components:

- **header.html**: Navigation and site header
- **hero.html**: Hero section with main call-to-action
- **rsvp.html**: Sign-up form section
- **game-setup.html**: Game setup information
- **rules.html**: Game rules
- **field-layout.html**: Field dimensions and layout
- **location.html**: Location information
- **footer.html**: Site footer

These components are loaded dynamically using JavaScript, allowing for easier maintenance and updates.

### 2. Modular CSS Architecture

CSS is organized using a component-based approach:

- **Base styles**: Variables and global styles
- **Component-specific styles**: Each component has its own CSS file
- **main.css**: Imports all the modular CSS files

### 3. JavaScript Modules

JavaScript is organized into modules:

- **navigation.js**: Navigation functionality
- **ui-effects.js**: UI animations and effects
- **data-loader.js**: Loads and processes JSON data
- **component-loader.js**: Loads HTML components
- **template-processor.js**: Processes HTML templates

### 4. Data-Driven Content

Content is separated from presentation using JSON data files:

- **events.json**: Event details
- **rules.json**: Game rules
- **field-info.json**: Field information

### 5. Template System

A simple template system allows for easy creation of new pages:

- **base.html**: Base template with placeholders
- **template-processor.js**: Processes templates and replaces placeholders

## Setup Instructions

1. Copy all vendor files (Bootstrap, AOS, etc.) to `/modular/assets/vendor/`
2. Copy all image files to `/modular/assets/img/`
3. Open `index.html` in a web browser to view the modular version of the website

## Creating a New Page

1. Create a new HTML file based on `templates/base.html`
2. Replace the placeholders with your content:
   - `{{PAGE_TITLE}}`: The title of the page
   - `{{PAGE_DESCRIPTION}}`: Meta description
   - `{{PAGE_KEYWORDS}}`: Additional keywords
   - `{{BODY_CLASS}}`: CSS class for the body element
   - `{{MAIN_CONTENT}}`: The main content of the page
   - `{{ADDITIONAL_CSS}}`: Any additional CSS files
   - `{{ADDITIONAL_JS}}`: Any additional JavaScript files

Example:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Head content from template -->
  <title>My New Page - Wizards Wiffle Ball Club</title>
</head>
<body class="inner-page">
  <!-- Header component -->
  <div id="header-container"></div>
  
  <main class="main">
    <!-- Your page content here -->
  </main>
  
  <!-- Footer component -->
  <div id="footer-container"></div>
  
  <!-- Scripts -->
</body>
</html>
```

## Adding a New Component

1. Create a new HTML file in the `components/` directory
2. Add the component's HTML content
3. Create a corresponding CSS file in `assets/css/components/`
4. Import the CSS file in `assets/css/main.css`
5. Add the component to the component loader in `assets/js/modules/component-loader.js`

## Updating Content

To update dynamic content, edit the corresponding JSON file in the `data/` directory:

- Event details: `data/events.json`
- Game rules: `data/rules.json`
- Field information: `data/field-info.json`
