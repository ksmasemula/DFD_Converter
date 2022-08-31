const cors = require('cors');
const express = require("express");
const bodyPaser = require('body-parser');
const multer = require('multer');
const {readFileSync} = require('fs');
const pako = require('pako');

const app = express();
const router = express.Router();

app.use(bodyPaser.urlencoded({extended:true}));
app.use(bodyPaser.json());

app.use(cors({origin:'*'}));
const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'./')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

let upload = multer({storage: storage});
let realFile = null;

router.route("/drawio")
    .post(upload.single('file'),(req,res)=>{
        const file = req.file;
        
        if (!file) {
            return res.json({result:'no file found'})
        }

        try {
            const data = readFileSync('Test_Dfd_diagram.drawio','utf-8');
            console.log(data);
            // const results = req.body;
            const pay = {pay:data};
            console.log(file.filename);
            return res.json(pay);
            
        } catch (error) {
            console.log(error);
        }

       
    })
    .get((req, res) => {
        const response = {hello:'Hello world'}
        return res.json(response);
    }
);

app.use('/api',router);

app.listen(3000, () => {
  console.log("listening on port 3000");
});


function decode(data)
{
    try
    {
        var node = parseXml(data).documentElement;

        if (node != null && node.nodeName == 'mxfile')
        {
            var diagrams = node.getElementsByTagName('diagram');

            if (diagrams.length > 0)
            {
                data = getTextContent(diagrams[0]);
            }
        }
    }
    catch (e)
    {
        // ignore
        console.log(e);
    }

    // if (document.getElementById('base64Checkbox').checked)
    // {
    //     try
    //     {
    //         data = atob(data);
    //     }
    //     catch (e)
    //     {
    //         console.log(e);
    //         alert('atob failed: ' + e);

    //         return;
    //     }
    // }

    if (data.length > 0)
    {
        try
        {
            data = pako.inflateRaw(Uint8Array.from(data, c => c.charCodeAt(0)), {to: 'string'});
        }
        catch (e)
        {
            console.log('inflateRaw failed: ' + e);
            // alert('inflateRaw failed: ' + e);

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
    	realFile = data;
    }
};

function parseXml(xml)
{
    // if (DOMParser)
    // {
    //     var parser = new DOMParser();

    //     return parser.parseFromString(xml, 'text/xml');
    // }
    // else
    // {
        var result = createXmlDocument();

        result.async = 'false';
        result.loadXML(xml);

        return result;
    // }
};

function createXmlDocument()
{
    var doc = null;

    // if (document.implementation && document.implementation.createDocument)
    // {
    //     doc = document.implementation.createDocument('', '', null);
    // }
    // else if (window.ActiveXObject)
    // {
        doc = new ActiveXObject('Microsoft.XMLDOM');
    // }

    return doc;
};

function getTextContent(node)
{
    return (node != null) ? node[(node.textContent === undefined) ? 'text' : 'textContent'] : '';
};


function formatXml()
{
  try
  {
    var xmlDoc = new DOMParser().parseFromString(document.getElementById('textarea').value, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>'
    ].join('\n'), 'application/xml');

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);

    document.getElementById('textarea').value = resultXml;
  }
  catch (e)
  {
    alert(e.message);
  }
};