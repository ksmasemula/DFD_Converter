import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import { UploaderService } from '../shared/uploader.service';






//
import { inflate, deflate,inflateRaw } from 'pako';


@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  file:any=[];
  form:FormGroup = new FormGroup({});
  constructor(private uploaderService: UploaderService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      file: []
    });
  }

  public onFileChange(event: any) {
    const files:File = event.target.files[0];
    if (files) {
      this.file = files;
      console.log(files);

    }
  }

  // public onFileChange(event: any) {
  //   const files:File = event.target.files[0];
  //   if (files) {
  //     this.file = files;
  //   }
  // }
  convFile:any;

  realValue:any;

  identifyShapes(){

      console.log('i am here');

      const data = new FormData();

      data.append('file',this.file);

      this.uploaderService.uploadFile(data).subscribe({
        next:(res)=>{
          console.log(res);
          this.convFile = res;

          console.log(this.convFile.pay);
          this.realValue = this.decode(this.convFile.pay);


        }
      });
      console.log(data);
  }

  // uploadFile(data:any) {
  //   const url = 'http://localhost:8080/api/import';

  //   return this.http.post(url,data);
  // }

  decode(data:any)
  {
      try
      {
          let testpraser = this.parseXml(data);
          let node = testpraser?.documentElement||null;

          if (node != null && node.nodeName == 'mxfile')
          {
              let diagrams = node.getElementsByTagName('diagram');

              if (diagrams.length > 0)
              {
                  data = this.getTextContent(diagrams[0]);
              }
          }
      }
      catch (e)
      {
          // ignore
      }

      // if (document.getElementById('base64Checkbox').checked)
      // {
          try
          {
              data = atob(data);
          }
          catch (e)
          {
              console.log(e);
              alert('atob failed: ' + e);

              return;
          }
      // }

      if (data.length > 0)
      {
          try
          {
              // const pako = require('pako');
             console.log('after atob ',data);

              data = inflateRaw(Uint8Array.from(data, c => c), {to: 'string'});
          }
          catch (e)
          {
              console.log(e);
              alert('inflateRaw failed: ' + e);

              return;
          }
      }

      // if (document.getElementById('encodeCheckbox').checked)
      // {
      //     try
      //     {
      //         data = decodeURIComponent(data);
      //     }
      //     catch (e)
      //     {
      //         console.log(e);
      //         alert('decodeURIComponent failed: ' + e);

      //         return;
      //     }
      // }

    if (data.length > 0)
    {
        this.test = data;
      }
  };

  test:any;

  inflatRaw:any;

  parseXml(xml:any)
  {
      // if (window.DOMParser)
      // {
          let parser = new DOMParser();

          return parser.parseFromString(xml, 'text/xml');
      // }
      // else
      // {
      //     let result = this.createXmlDocument();

      //     result.async = 'false';
      //     result.loadXML(xml);

      //     return result;
      // }
  };

  createXmlDocument()
  {
      let doc = null;

      if (document.implementation && document.implementation.createDocument)
      {
          doc = document.implementation.createDocument('', '', null);
      }
      // else if (window.ActiveXObject)
      // {
      //     doc = new ActiveXObject('Microsoft.XMLDOM');
      // }

      return doc;
  };

  getTextContent(node:any)
  {
      return (node != null) ? node[(node.textContent === undefined) ? 'text' : 'textContent'] : '';
  };
}
