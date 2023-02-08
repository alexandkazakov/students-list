(() => {
    let students = [];

    function clearTable() {
        let trItems = document.querySelectorAll('.tr');
        trItems.forEach((trItem) => {
            trItem.remove();
        })
    }

    function parseStudents(arr) {
        clearTable();
        arr.forEach((student) => {
            parseStudent(student);
        });
    }

    function parseStudent(student) {
        let tr = document.createElement('tr');
        let fullName = document.createElement('td');
        let faculty = document.createElement('td');
        let birthday = document.createElement('td');
        let years = document.createElement('td');
        let deleteItem = document.createElement('td');
        let deleteBtn = document.createElement('button');

        student.birthday = new Date(student.birthday);
        let [year, month, day] = [String(student.birthday.getFullYear()), String(student.birthday.getMonth() + 1), String(student.birthday.getDate())];
        if (month < 10) {
            month = '0' + month;
        };
        if (day < 10) {
            day = '0' + day;
        }
        let age = Math.abs(new Date(Date.now() - student.birthday).getUTCFullYear() - 1970);

        fullName.textContent = student.surname + ' ' + student.name + ' ' + student.middleName;
        faculty.textContent = student.faculty;
        birthday.textContent = day + '.' + month + '.' + year + ` (${age})`;

        if ((new Date() - new Date(student.startYear + 4, 8, 1)) > 0) {
            years.textContent = student.startYear + '-' + (student.startYear + 4) + ' (закончил)';
        } else {
            years.textContent = student.startYear + '-' + (student.startYear + 4) + ' (' + (Math.abs(new Date(Date.now() - new Date(student.startYear, 8, 1)).getFullYear() - 1970) + 1) + ' курс)';
        }

        tr.classList.add('tr');
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.textContent = 'Удалить';

        deleteBtn.addEventListener('click', () => {
            if (confirm('Вы уверены?')) {
                students.splice(students.indexOf(student), 1);
                localStorage.setItem('students', JSON.stringify(students));
                if (students.length !== 0) {
                    parseStudents(students);
                } else if (students.length === 0) {
                    listEmpty.classList.remove('display-none');
                    clearTable();
                };
            }
        })
        
        deleteItem.append(deleteBtn);
        tr.append(fullName);
        tr.append(faculty);
        tr.append(birthday);
        tr.append(years);
        tr.append(deleteItem);
        tbody.append(tr);
    }

    function sortUsers(arr, prop, dir = false) {
        return arr.sort( (a, b) => (dir ? a[prop] > b[prop] : a[prop] < b[prop]) ? -1 : 1 );
    }

    function filterUsers(arr, prop, value) {
        let result = [];
        for (let item of arr) {
            if (String(item[prop]).includes(value)) {
                result.push(item);
            }
        }
        return result;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const tbody = document.getElementById('tbody');
        const form = document.querySelector('.form');
        const listEmpty = document.querySelector('.list-empty');
        const sortFullNameLink = document.querySelector('.sort-full-name');
        const sortFacultyLink = document.querySelector('.sort-faculty');
        const sortBirthdayLink = document.querySelector('.sort-birthday');
        const sortYearsLink = document.querySelector('.sort-years');
        const filterFullNameInput = document.getElementById('full-name-filter');
        const filterFacultyInput = document.getElementById('faculty-filter');
        const filterStartYearInput = document.getElementById('start-year-filter');
        const filterEndYearInput = document.getElementById('end-year-filter');
        const filterBtn = document.getElementById('filter-btn');
        const filterReset = document.getElementById('filter-reset');
        const addStudentsBtn = document.querySelector('.add-student');
        const closeFormBtn = document.getElementById('close-form');

        let restoredStudents = JSON.parse(localStorage.getItem('students'))
        if (restoredStudents) students = restoredStudents;
        
        if (students.length !== 0) {
            parseStudents(students);
        } else if (students.length === 0) {
            listEmpty.classList.remove('display-none');
        };

        addStudentsBtn.addEventListener('click', () => {
            form.classList.toggle('visible');
        })

        closeFormBtn.addEventListener('click', () => {
            form.classList.remove('visible');
        })

        form.addEventListener('submit', (elem) => {
            elem.preventDefault();
            form.classList.remove('visible');

            let inputName = document.getElementById('name');
            let inputSurname = document.getElementById('surname');
            let inputMiddleName = document.getElementById('middle-name');
            let inputBirthday = document.getElementById('birthday');
            let inputStartYear = document.getElementById('start-year');
            let inputFaculty = document.getElementById('faculty');
            let errorLabel = document.querySelector('.form-error');

            let inputNameValue = inputName.value.trim();
            let inputSurnameValue = inputSurname.value.trim();
            let inputMiddleNameValue = inputMiddleName.value.trim();
            let inputBirthdayValue = inputBirthday.valueAsDate;
            let inputStartYearValue = inputStartYear.value.trim();
            let inputFacultyValue = inputFaculty.value.trim();

            let err = (!inputNameValue) ? 'Введите имя' :
                (!inputSurnameValue) ? 'Введите фамилию' :
                (!inputMiddleNameValue) ? 'Введите отчество' :
                ((!inputBirthdayValue) || (inputBirthdayValue < new Date(1900, 0, 1)) || (inputBirthdayValue > Date.now())) ? 'Введите дату рождения' :
                ((!inputStartYearValue) || (inputStartYearValue < 2000) || (inputStartYearValue > new Date().getFullYear())) ? 'Введите год начала обучения' :
                (!inputFacultyValue) ? 'Введите факультет' :
                null;

            if (err) {
                errorLabel.textContent = err;
                errorLabel.classList.add('visible');
            } else {
                errorLabel.classList.remove('visible');
                students.push(
                    {
                        name: inputNameValue,
                        surname: inputSurnameValue,
                        middleName: inputMiddleNameValue,
                        birthday: inputBirthdayValue,
                        startYear: +inputStartYearValue,
                        faculty: inputFacultyValue
                    }
                );
                listEmpty.classList.add('display-none');
                localStorage.setItem('students', JSON.stringify(students));
                parseStudents(students);

                inputName.value = '';
                inputSurname.value = '';
                inputMiddleName.value = '';
                inputBirthday.value = '';
                inputStartYear.value = '';
                inputFaculty.value = '';
            }
        })
        
        let sortFullNameDir = false;
        sortFullNameLink.addEventListener('click', () => {
            if (sortFullNameDir) {
                parseStudents(sortUsers(students, 'surname', true));
                sortFullNameDir = false;
            } else {
                parseStudents(sortUsers(students, 'surname'));
                sortFullNameDir = true;
            }
        });

        let sortFacultyDir = false;
        sortFacultyLink.addEventListener('click', () => {
            if (sortFacultyDir) {
                parseStudents(sortUsers(students, 'faculty', true));
                sortFacultyDir = false;
            } else {
                parseStudents(sortUsers(students, 'faculty'));
                sortFacultyDir = true;
            }
        });

        let sortBirthdayDir = false;
        sortBirthdayLink.addEventListener('click', () => {
            if (sortBirthdayDir) {
                parseStudents(sortUsers(students, 'birthday', true));
                sortBirthdayDir = false;
            } else {
                parseStudents(sortUsers(students, 'birthday'));
                sortBirthdayDir = true;
            }
        });

        let sortYearsDir = false;
        sortYearsLink.addEventListener('click', () => {
            if (sortYearsDir) {
                parseStudents(sortUsers(students, 'startYear', true));
                sortYearsDir = false;
            } else {
                parseStudents(sortUsers(students, 'startYear'));
                sortYearsDir = true;
            }
        });

        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let studentsFiltered = [...students];
            for (const student of studentsFiltered) {
                student.fullName = student.surname + ' ' + student.name + ' ' + student.middleName;
                student.endYear = student.startYear + 4;
            }

            if (filterFullNameInput.value !== '') studentsFiltered = filterUsers(studentsFiltered, 'fullName', filterFullNameInput.value);
            if (filterFacultyInput.value !== '') studentsFiltered = filterUsers(studentsFiltered, 'faculty', filterFacultyInput.value);
            if (filterStartYearInput.value !== '') studentsFiltered = filterUsers(studentsFiltered, 'startYear', filterStartYearInput.value);
            if (filterEndYearInput.value !== '') studentsFiltered = filterUsers(studentsFiltered, 'endYear', filterEndYearInput.value);

            parseStudents(studentsFiltered);
        })

        filterReset.addEventListener('click', () => {
            parseStudents(students);
        })

        window.tbody = tbody;
        window.listEmpty = listEmpty;
    })
})();