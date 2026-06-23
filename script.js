const menubtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");

const categoriesContainer = document.getElementById("categories");
const categoryList = document.getElementById("categoryList");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const mealsContainer = document.getElementById("mealsContainer");

const categoryMeals = document.getElementById("categoryMeals");
const categoryTitle = document.getElementById("categoryTitle");
const categoryMealsContainer = document.getElementById(
  "categoryMealsContainer",
);
const categoryDescription = document.getElementById("categoryDescription");

const mealDetails = document.getElementById("mealDetails");

const breadcrumb = document.getElementById("breadcrumb");

const detailImage = document.getElementById("detailImage");
const detailName = document.getElementById("detailName");
const detailCategory = document.getElementById("detailCategory");
const detailArea = document.getElementById("detailArea");
const detailSource = document.getElementById("detailSource");
const detailTags = document.getElementById("detailTags");

const ingredientsBox = document.getElementById("ingredientsBox");
const measuresBox = document.getElementById("measuresBox");
const instructionsBox = document.getElementById("instructionsBox");

let allCategories = [];

menubtn.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

searchBtn.addEventListener("click", searchMeals);

async function getCategories() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php",
    );

    const data = await response.json();

    allCategories = data.categories;

    displayCategories(data.categories);
  } catch (error) {
    console.log(error);
  }
}

function displayCategories(categories) {
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `<div class="category-card"
    onclick="getMealsByCategory('${category.strCategory}')">

      <span class="badge">
      ${category.strCategory.toUpperCase()}
      </span>

        <img src="${category.strCategoryThumb}" alt="${category.strCategory}">


            </div>`;
    categoryList.innerHTML += `
    <li onclick="selectCategory(this,'${category.strCategory}')">
   ${category.strCategory}</li>`;
  });
}
getCategories();

function selectCategory(element, categoryName) {
  document.querySelectorAll("#categoryList li").forEach((item) => {
    item.classList.remove("active-category");
  });
  element.classList.add("active-category");
  getMealsByCategory(categoryName);
}

async function searchMeals() {
  console.log("search button clicked");
  const searchText = searchInput.value.trim();
  console.log(searchText);

  if (searchText === "") {
    return;
  }

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`,
    );
    const data = await response.json();
    mealsContainer.innerHTML = "";
    if (data.meals) {
      categoryMeals.style.display = "none";
      document.querySelector(".categories-section").style.display = "block";
      data.meals.forEach((meal) => {
        mealsContainer.innerHTML += `<div class="meal-card" onclick="getMealDetails('${meal.idMeal}')">
        <div class="meal-image">
        <img src="${meal.strMealThumb}"
        alt="${meal.strMeal}">
        <span class="meal-badge">
        ${meal.strCategory}
        </span>
        </div>
        <p class="meal-area">
        ${meal.strArea}
        </p>
        <h4>${meal.strMeal}</h4>
        </div>`;
      });
      searchResults.style.display = "block";
    } else {
      mealsContainer.innerHTML = "<p>No meals found</p>";
    }
  } catch (error) {
    console.log(error);
  }
}

async function getMealsByCategory(categoryName) {
  sidebar.classList.remove("active");

  searchResults.style.display = "none";

  document.querySelector(".categories-section").style.display = "none";

  categoryMeals.style.display = "block";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
    );

    const data = await response.json();

    categoryTitle.textContent = categoryName.toUpperCase();

    const selectedCategory = allCategories.find(
      (cat) => cat.strCategory === categoryName,
    );

    categoryDescription.textContent = selectedCategory.strCategoryDescription;

    categoryMealsContainer.innerHTML = "";

    data.meals.forEach((meal) => {
      categoryMealsContainer.innerHTML += `<div class="meal-card" onclick="getMealDetails('${meal.idMeal}')">
      <img src="${meal.strMealThumb}"
      alt="${meal.strMeal}">
      <h4>${meal.strMeal}</h4>
      </div>`;
    });

    categoryMeals.style.display = "block";

    categoryMeals.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.log(error);
  }
}

async function getMealDetails(id) {
  searchResults.style.display = "none";
  categoryMeals.style.display = "none";

  document.querySelector(".categories-section").style.display = "none";

  try {
    const response = await fetch(
      ` https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    );

    const data = await response.json();

    const meal = data.meals[0];

    breadcrumb.textContent = `${meal.strCategory}/${meal.strMeal}`;

    detailImage.src = meal.strMealThumb;

    detailName.textContent = meal.strMeal;

    detailCategory.textContent = meal.strCategory;

    detailArea.textContent = meal.strArea;

    detailSource.href = meal.strSource || "#";

    detailTags.textContent = meal.strTags || "No Tags";

    let ingredients = "";

    let measures = "";

    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim()) {
        ingredients += `<li>${meal[`strIngredient${i}`]}</li>`;

        measures += `<li>${meal[`strMeasure${i}`]}</li>`;
      }
    }

    ingredientsBox.innerHTML = `<h3>Ingredients</h3>
    <ul>${ingredients}</ul>`;

    measuresBox.innerHTML = `<h3>Measures</h3>
    <ul>${measures}</ul>`;

    instructionsBox.innerHTML = `<h3>Instructions</h3>
    <p>${meal.strInstructions}</p>`;

    mealDetails.style.display = "block";

    mealDetails.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.log(error);
  }
}
