import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Email } from '../assets/js/custom.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = '';
  willDownload = false;
  jsonXMLData: any[] = [];
  phoneNumber = [];
  constructor() {}
  ngOnInit() {}
  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = event => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.jsonXMLData = jsonData.Sayfa1;
      const dataString = JSON.stringify(jsonData);
      document.getElementById('output').innerHTML = dataString
        .slice(0, 300)
        .concat('...');
    };
    reader.readAsBinaryString(file);
  }
  async wpSendMessage() {
    //SEND WHATSAPP MESSAGE
    let onay = await confirm(
      'Toplu Whatsapp Mesajı Göndermek İstiyor musunuz?'
    );
    if (onay == true) {
      this.jsonXMLData.map(x => {
        this.phoneNumber.push(x.Telefon_Numarası);
      });
    }
  }
  async sendEmail() {
    let onay = await confirm('Toplu Mail Göndermek İstiğinize Emin misiniz?');
    if (onay == true) {
      Email.send({
        Host: 'smtp.gmail.com',
        Username: 'test@gmail.com',
        Password: 'test',
        To: 'test@gmail.com,test@gmail.com',
        From: 'test@gmail.com',
        Subject: 'Test Başlık',
        Body: 'Test İçerik'
      })
        .then(() => alert('Mailiniz Başarıyla İletilmiştir.'))
        .catch(err => {
          alert('Beklenmedik Hata ! ' + err);
        });
    }
  }
}
