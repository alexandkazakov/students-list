(() => {
  function filterNumbers(arr, prop, value) {
    const result = [];
    for (const item of arr) {
      if (String(item[prop]).includes(value)) {
        result.push(item);
      }
    }
    return result;
  }

  function uploadFile(fileUploader, arr) {
    const selectedFile = fileUploader.files[0];
    
    const reader = new FileReader();
    reader.readAsBinaryString(selectedFile);
    reader.onerror = event => console.error(`Файл не может быть прочитан. Ошибка: ${event.target.error.message}`);
    reader.onload = event => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      workbook.SheetNames.forEach(sheetName => {
        const rowArray = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        rowArray.forEach(item => {
          arr.push({
            fullNumber: item.Name.toUpperCase(),
            letters: (item.Name.substr(0, 1) + item.Name.substr(4, 2)).toUpperCase(),
            numbers: item.Name.substr(1, 3),
            region: item.Name.slice(6)
          });
        })
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const fileUploader = document.getElementById('file-uploader-input');
    const filterLettersInput = document.getElementById('filter__letters');
    const filterNumbersInput = document.getElementById('filter__numbers');
    const filterRegionInput = document.getElementById('filter__region');
    const filterBtn = document.getElementById('filter-btn');
    const filterReset = document.getElementById('filter-reset');
    const resultBlock = document.getElementById('result');

    const numbers = [];

    fileUploader.addEventListener('change', () => {
      uploadFile(fileUploader, numbers);
    });

    filterBtn.addEventListener('click', event => {
      event.preventDefault();
      resultBlock.textContent = '';
      let numbersFiltered = [...numbers];

      if (!fileUploader.files[0]) {
        resultBlock.textContent = 'Выберите файл для поиска';
        return;
      }

      if (filterLettersInput.value === '' && filterNumbersInput.value === '' && filterRegionInput.value === '') {
        resultBlock.textContent = 'Введите данные для поиска';
        return;
      }

      if (filterLettersInput.value !== '') numbersFiltered = filterNumbers(numbersFiltered, 'letters', filterLettersInput.value.toUpperCase());
      if (filterNumbersInput.value !== '') numbersFiltered = filterNumbers(numbersFiltered, 'numbers', filterNumbersInput.value);
      if (filterRegionInput.value !== '') numbersFiltered = filterNumbers(numbersFiltered, 'region', filterRegionInput.value);

      const resultSpan = document.createElement('span');
      if (numbersFiltered.length > 0) {
        resultSpan.classList.add('badge', 'text-bg-success');
        resultSpan.textContent = 'Номер найден';
      } else {
        resultSpan.classList.add('badge', 'text-bg-danger');
        resultSpan.textContent = 'Номер не найден';
      }
      resultBlock.append(resultSpan);
    })

    filterReset.addEventListener('click', () => {
      resultBlock.textContent = '';
    });
  })
})();