import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(path):
    try:
        z = zipfile.ZipFile(path)
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        text_lines = []
        for p in tree.findall('.//w:p', ns):
            text = ''.join(node.text for node in p.findall('.//w:t', ns) if node.text)
            text_lines.append(text)
        
        with open('prd_text.txt', 'w', encoding='utf-8') as f:
            f.write('\n'.join(text_lines))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    read_docx(sys.argv[1])
