const log = console.log;
const $ = n => document.querySelector(n);
import axios from 'axios';
let editid = '';


const nodes = {
  addForm: $('.add-form'),
  SubmitAddForm: $('.add-form button'),
  queryForm: $('.query-form'),
  SubmitQueryForm: $('.query-form button'),
  tbody: $('.data-table tbody'),
  updateCustomer: $('.update-customer')
}

const len = n => n.length > 0 ? true : false;
const qs = (elem, target) => elem.querySelector(target);
const $$ = n => document.querySelectorAll(n);

const {
  addForm,
  SubmitAddForm,
  queryForm,
  SubmitQueryForm,
  tbody,
  updateCustomer
} = nodes;

function handleSubmitAddForm(event) {
  event.preventDefault();
  const name = addForm['name'].value;
  const age = addForm['age'].value;
  const email = addForm['email'].value;

  if (len(name) && len(email) && age >= 0) {
    axios.post('http://localhost:3000/customers', {
      name,
      age,
      email
    })
      .then(renderCustomers)
  }
}
addForm.addEventListener('submit', handleSubmitAddForm);

function tableRow(item, index) {
  return ` <tr data-id = ${item.id}>
  <td>${index}</td>
  <td class = 'table-name'>${item.name}</td>
  <td class = 'table-age'>${item.age}</td>
  <td class = 'table-email'>${item.email}</td>
  <td class="table-actions">
    <button class = 'edit-customer'>edit</button>
    <button class = 'delete-customer'>delete</button>
  </td>
</tr>`
}

function renderCustomers() {
  axios.get('http://localhost:3000/customers')
    .then(res => {
      let a = ''
      res.data.forEach((x, i) => {
        a += tableRow(x, i + 1)
      })
      tbody.innerHTML = a;
    })
}

function handleUpdate(event) {
  event.preventDefault();
  axios.patch(`http://localhost:3000/customers/${editid}`, {
    name: addForm['name'].value,
    age: addForm['age'].value,
    email: addForm['email'].value,
    id: editid
  })
    .then(renderCustomers)
}
updateCustomer.onclick = handleUpdate;


function handleMutation(event) {
  if (event.target.classList.contains('edit-customer')) {
    const parent = event.target.parentNode.parentNode;
    const parentid = parent.dataset.id;
    axios.get(`http://localhost:3000/customers/${parentid}`)
      .then(res => {
        addForm['name'].value = res.data.name;
        addForm['age'].value = res.data.age;
        addForm['email'].value = res.data.email;
        // parent.style.border = "1px solid steelblue !important"
        parent.style.background = "lightblue"
        $$('.edit-customer').forEach(x => x.disabled = true)
        $$('.delete-customer').forEach(x => x.disabled = true)
        updateCustomer.style.display = 'block'
        editid = parentid;
        $('.intent-header').textContent = 'Update Customer'
        SubmitAddForm.style.display = 'none'
      })
  }
  if (event.target.classList.contains('delete-customer')) {
    const parent = event.target.parentNode.parentNode;
    const parentid = parent.dataset.id;
    axios.delete(`http://localhost:3000/customers/${parentid}`)
      .then(res => {
        $$('.edit-customer').forEach(x => x.disabled = true)
        $$('.delete-customer').forEach(x => x.disabled = true)
        renderCustomers();
      })
  }
}
tbody.addEventListener('click', handleMutation)

function handleQuery(event) {
  event.preventDefault();
  const queryid = queryForm['id'].value;
  if (len(queryid)) {
    axios.get(`http://localhost:3000/customers/${queryid}`)
      .then(res => {
        if (res.status === 200) {
          const { name, email, age } = res.data;
          $('.query-form-output').innerHTML = `name: ${name}<br> age: ${age}<br> email: ${email}`;
        }
        else {
          $('.query-form-output').textContent = 'Customer with that id is not on our database'
        }
      })
  }
}

queryForm.onsubmit = handleQuery;




renderCustomers()