<template>
  <button
    class="save-button"
    @click="saveReport"
  >
    Save PDF
  </button>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
export default {
  props: {
    fileName: {
      type: String,
      default: 'report',
      require: true
    },
    id: {
      type: String,
      default: 'report',
      require: true
    }
  },
  created() {
    console.log(jsPDF);
    console.log(html2canvas);
  },
  methods: {
    saveReport() {
      window.scrollTo(0, 0);
      var svgElem = document.getElementsByTagName("svg");
      for (const node of svgElem) {
        node.setAttribute(
            "font-family",
            "monospace"
            //window.getComputedStyle(node, null).getPropertyValue("font-family")
        );
        node.replaceWith(node);
      }
      html2canvas(document.getElementById(this.id), { scale: 2, scrollX: 0,
        scrollY: 0 }).then((canvas) =>
              {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                  orientation: 'l', // landscape
                  unit: 'pt', // points, pixels won't work properly
                  format: [canvas.width, canvas.height] // set needed dimensions for any element
                });
                pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, 'someAlias' ,'FAST');
                // const imgProps= pdf.getImageProperties(imgData);
                // const pdfWidth = pdf.internal.pageSize.getWidth();
                // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('report.pdf');
              }
          // {
          //   let pdf = new jsPDF("p", "pt", [
          //     (canvas.width - 18)/2,
          //     canvas.height /2
          //   ]);
          //   pdf.addImage(
          //       canvas.toDataURL("image/png"),
          //       "PNG",
          //       -9,
          //       0,
          //       canvas.width / 2,
          //       canvas.height / 2,'someAlias', 'FAST'
          //   );
          //   pdf.save(`${this.fileName}.pdf`);
          // }
      );
    }
  }
};
</script>

<style scoped>
.save-button {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background-color: var(--reflex-bluet);
  border: none;
  border-radius: 3px;
  color: var(--white);
  cursor: pointer;
  font-weight: bold;
  line-height: 1.29;
  min-width: 100px;
  padding: 6px;
  text-align: center;
  text-transform: uppercase;
  z-index: 10;
}
.html2canvas-container { width: 3000px !important; height: 1500px !important; }
</style>