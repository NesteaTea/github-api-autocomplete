const search = document.querySelector(".repository__search");
const dropDown = document.querySelector(".repository__dropdown");
const repositoryList = document.querySelector(".repository__list");

const debounce = (fn, throttleTime) => {
  let stopTime = null;
  return function (...args) {
    clearTimeout(stopTime);
    stopTime = setTimeout(() => {
      fn.apply(this, args);
    }, throttleTime);
  };
};

function test() {
    const removeItem = document.querySelectorAll('.repository__item')

    removeItem.forEach((el) => {
        el.addEventListener('click', (event) => {
            event.target.closest('.repository__item').remove()
        })
    })
}

const getRepositories = async () => {
  try {
    if (search.value === "") {
      dropDown.innerHTML = "";
      return;
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${search.value}&sort=stars&order=desc&per_page=5`
    );
    const result = await response.json();

    let repositories = result.items;

    let dropDownHTML = "";
    for (const repository of repositories) {
      dropDownHTML += `<li class='repository__dropdown-item' data-js-addrepository>${repository.name}</li>`;
    }
    dropDown.innerHTML = dropDownHTML;
    const dropDownChildrens = [...dropDown.children].forEach((element) => {
      element.onclick = function (e) {
        const repositoriesFilter = repositories.filter(
            (elem) => elem.name === e.target.textContent
        )
        if (e.target.dataset.jsAddrepository === "") {
          const repositoryItem = `<li class="repository__item">
                    <div class="repository__info">
                        <p>Name: ${repositoriesFilter[0].name}</p>
                        <p>Owner: ${repositoriesFilter[0].owner.login}</p>
                        <p>Stars: ${repositoriesFilter[0].stargazers_count}</p>
                    </div>
                    <button class="repository__delete" type="button" onclick='test()' data-js-delete></button>
                    </li>`;
          repositoryList.insertAdjacentHTML("afterbegin", repositoryItem);
          search.value = "";
          dropDown.innerHTML = "";
        }
      };
    });
  } catch (e) {
    console.log(e);
  }
};

search.addEventListener("input", debounce(getRepositories, 300));
