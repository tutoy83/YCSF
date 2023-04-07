import { Component, ViewChild, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';


interface Stage {
  nom: string;
  prix: number;
}

interface StageDemande {
  nom: string;
  prixPublic: number;
  prixRemise: number;
}

interface optionDemande {
  nom: string;
  prixPublic: number;
}

@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent {

  stages: Stage[] = [
    { nom: 'Moussaillons', prix: 121 },
    { nom: 'OptiMouss', prix: 118},
    { nom: 'Optimist', prix: 118},
    { nom: 'Kayak', prix: 97},
    { nom: 'Planche Ados', prix: 135},
    { nom: 'Catamaran Ados', prix: 146},
    { nom: 'Catamaran Adultes', prix: 174},
    { nom: 'Planche Adultes', prix: 145},
    { nom: 'Deriveur (Vago/laser)', prix: 140},
    { nom: 'Multi-Activites', prix: 130},
  ];


  commande: { [nom: string]: number } = {};


  total: number = 0;
  caroleStatus: boolean = false;

  stagesDemandesArr: StageDemande[] = [];

  optionsDemandesArr: optionDemande[] = [];

  ajouterStageDemande(stage: Stage): void {
    const nbStages = this.stagesDemandesArr.length;

    if (nbStages < 3){
      const stageDemande: StageDemande = {
        nom: stage.nom,
        prixPublic: stage.prix,
        prixRemise: stage.prix
      };

      this.stagesDemandesArr.push(stageDemande);
      for (let i = 0; i < this.stagesDemandesArr.length; i++) {
        for (let j = i + 1; j < this.stagesDemandesArr.length; j++) {
          if (this.stagesDemandesArr[i].prixPublic === this.stagesDemandesArr[j].prixPublic) {
            this.stagesDemandesArr[j].prixPublic += 0.000001 * (j - i);
          }
        }
      }
      this.totalCalc();
    }else{
      alert("⚠️ Vous avez déjà 3 stages ");
    }
  }

  ajouterPassport():void{
    const optionDemande: optionDemande = {
      nom: "Passport Voile",
      prixPublic: 12
    };

    this.optionsDemandesArr.push(optionDemande);
    this.totalCalc();
  }

  ajouterCotis():void{
    const optionDemande: optionDemande = {
      nom: "Cotisation YCSF",
      prixPublic: 19
    };

    this.optionsDemandesArr.push(optionDemande);
    this.totalCalc();
  }

  totalCalc(): number {
    this.total = 0;
    const nbStages = this.stagesDemandesArr.length;
  
    if (nbStages === 0) {
      return this.total;
    } else if (nbStages === 1) {
      return this.stagesDemandesArr[0].prixRemise;
    } else if (nbStages === 2) {
      const stage1 = this.stagesDemandesArr[0];
      const stage2 = this.stagesDemandesArr[1];
      const moussaillonsOuKayak = stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak' || stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak';
  
      if (moussaillonsOuKayak) {
        if (stage1.nom !== 'Moussaillons' && stage1.nom !== 'Kayak') {
            stage1.prixRemise = stage1.prixPublic * 0.95;
            this.total += stage1.prixRemise;
        } else if (stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak') {
            stage2.prixRemise = stage2.prixPublic * 0.95;
            this.total += stage2.prixRemise;
        } else {
          this.total += stage1.prixPublic + stage2.prixPublic;
        }
    } else {
        const stageAvecPrixPlusGrand = stage1.prixPublic > stage2.prixPublic ? stage1 : stage2;
        const stageAvecPrixPlusPetit = stage1.prixPublic > stage2.prixPublic ? stage2 : stage1;
      
        stageAvecPrixPlusGrand.prixRemise = stageAvecPrixPlusGrand.prixPublic * 0.95;
        this.total += stageAvecPrixPlusGrand.prixRemise;
        this.total += stageAvecPrixPlusPetit.prixPublic;
    }
    
    }
    else if (nbStages === 3) {
      const stage1 = this.stagesDemandesArr[0];
      const stage2 = this.stagesDemandesArr[1];
      const stage3 = this.stagesDemandesArr[2];
      const moussaillonsOuKayak = stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak' || stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak' || stage3.nom === 'Moussaillons' || stage3.nom === 'Kayak';
    
      if (moussaillonsOuKayak) {
        if (stage1.nom === 'Moussaillons' && stage2.nom === 'Moussaillons' && stage3.nom === 'Moussaillons' || stage1.nom === 'Kayak' && stage2.nom === 'Kayak' && stage3.nom === 'Kayak') {
            //INTERDIT - INTERDIT - INTERDIT
            this.total += stage1.prixPublic + stage2.prixPublic + stage3.prixPublic;
        } else if ((stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak') && (stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak') && stage3.nom !== 'Moussaillons' && stage3.nom !== 'Kayak') {
            //INTERDIT - INTERDIT - NORMAL  
            stage3.prixRemise = stage3.prixPublic * 0.9;
            this.total += stage1.prixPublic + stage2.prixPublic + stage3.prixRemise;
        } else if ((stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak') && stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak' && (stage3.nom === 'Moussaillons' || stage3.nom === 'Kayak')) {
            //INTERDIT - NORMAL - INTERDIT
            stage2.prixRemise = stage2.prixPublic * 0.9;
            this.total += stage1.prixPublic + stage2.prixRemise + stage3.prixPublic;
        }else if ((stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak') && stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak' && stage3.nom !== 'Moussaillons' && stage3.nom !== 'Kayak') {
            //INTERDIT - NORMAL - NORMAL
            stage2.prixRemise = stage2.prixPublic * 0.9;
            stage3.prixRemise = stage3.prixPublic * 0.95;
            this.total += stage1.prixPublic + stage2.prixRemise + stage3.prixPublic;
        } else if (stage1.nom !== 'Moussaillons' && stage1.nom !== 'Kayak' && (stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak') && (stage3.nom === 'Moussaillons' || stage3.nom === 'Kayak')) {
            //NORMAL - NORMAL - INTERDIT
            stage1.prixRemise = stage1.prixPublic * 0.9;
            stage2.prixRemise = stage2.prixPublic * 0.95;
            this.total += stage1.prixRemise + stage2.prixRemise + stage3.prixPublic;
        
        } else if (stage1.nom !== 'Moussaillons' && stage1.nom !== 'Kayak' && (stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak') && (stage3.nom === 'Moussaillons' || stage3.nom === 'Kayak')) {
            //NORMAL - INTERDIT - INTERDIT
            stage1.prixRemise = stage1.prixPublic * 0.9;
            this.total += stage1.prixRemise + stage2.prixPublic + stage3.prixPublic;
        }
        } else if (stage1.nom !== 'Moussaillons' && stage1.nom !== 'Kayak' && (stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak') && stage3.nom !== 'Moussaillons' && stage3.nom !== 'Kayak') {
          //NORMAL - INTERDIT - NORMAL                                                       TO DOUBLE CHECK
          stage1.prixRemise = stage1.prixPublic * 0.9;
          stage3.prixRemise = stage3.prixPublic * 0.95;
          this.total += stage1.prixRemise + stage2.prixPublic + stage3.prixRemise;
      
      } else {

          const stagesSortedByPrice = this.stagesDemandesArr.sort((a, b) => b.prixPublic - a.prixPublic);
          stagesSortedByPrice[0].prixRemise = stagesSortedByPrice[0].prixPublic * 0.9;
          stagesSortedByPrice[1].prixRemise = stagesSortedByPrice[1].prixPublic * 0.95;
          this.total += stagesSortedByPrice[0].prixRemise + stagesSortedByPrice[1].prixRemise + stagesSortedByPrice[2].prixPublic;
      }
  }

  for (let i = 0; i < this.optionsDemandesArr.length; i++) {
    this.total += this.optionsDemandesArr[i].prixPublic; // Ajoute le prixPublic de l'élément i à la variable total
  }

    console.log("Fin total", this.stagesDemandesArr);
    return this.total;
  }

  @ViewChild('tableRecap') table!: ElementRef;


  sendEmail() {
    const email = (document.getElementById('mailDest') as HTMLInputElement).value;
    const subject = 'Recapitulatif de la commande';
    let body = 'Bonjour,\nVous trouverez ci-dessous les informations demandees sur les stages. Pour realiser une inscription, merci de nous recontacter. \n Cordialement, \n\n';
    let totalPrinted = '\nTOTAL = ' + this.total + ' euros'
    for (const stageDemande of this.stagesDemandesArr) {
      body += `- ${stageDemande.nom} au prix de : ${stageDemande.prixRemise} euros\n`;
    }
    
    for (const optionDemande of this.optionsDemandesArr) {
      body += `- ${optionDemande.nom} au prix de : ${optionDemande.prixPublic} euros\n`;
    }
    
    const mailtoLink = 'mailto:' + email + '?subject=' + subject + '&body=' + encodeURIComponent(body) + totalPrinted;
    window.location.href = mailtoLink;
  }
  
  
genererPDF(): void {
  const doc = new jsPDF();
  const imgWidth = 74;
  const imgHeight = 30;
  const margin = doc.internal.pageSize.getWidth() / 2 - imgWidth / 2;

  // Ajouter l'image centrée
  doc.addImage('../../assets/YachtClub_v3.png', 'PNG', margin, 10, imgWidth, imgHeight);

  // Ajouter le titre
  const imgProperties = doc.getImageProperties('../../assets/YachtClub_v3.png');
  const titleY = 60;
  doc.setFontSize(22);
  doc.text('Récapitulatif des stages', doc.internal.pageSize.getWidth() / 2, titleY, { align: 'center' });

  doc.setFontSize(15);

  // Ajouter le corps
  let body = '';
  this.stagesDemandesArr.forEach((stage) => {
    body += '- ' + stage.nom + ': ' + stage.prixRemise.toFixed(2) + '€\n\n';
  });

  this.optionsDemandesArr.forEach((option) => {
    body += '- ' + option.nom + ': ' + option.prixPublic.toFixed(2) + '€\n\n';
  });

  doc.text(body, 15, titleY + 20);


  // Ajouter le texte
  doc.setFontSize(14);
  const text = "Tous les tarifs incluent les éventuelles remises.\nCe document n'est pas un bon de commande, pour réaliser une inscription, merci de nous contacter au 04 94 34 18 50.";
  const maxWidth = 170; // adjust the width to fit the text in the PDF

  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, 15, 250); 
  

  const now = new Date();
  const fileName = `recapitulatif_${now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' }).replace(/[/:\s]/g, '-')}.pdf`;
  doc.save(fileName);
  
  }


  reset(): void{
    this.stagesDemandesArr = [];
    this.optionsDemandesArr = [];
    this.total = 0;
  }
  
  carole(): void {
    let doc = document.getElementsByClassName('stageItem') as HTMLCollectionOf<HTMLElement>;
    let btnDoc = document.getElementsByClassName('btn-primary') as HTMLCollectionOf<HTMLElement>;

    this.caroleStatus = !this.caroleStatus;
  
    for (let i = 0; i < doc.length; i++) {
      if (this.caroleStatus) {
        doc[i].style.background = "linear-gradient(30deg, #ff3600, #f07406, rgb(230 255 0), #008058 )";
        btnDoc[i].style.background = "#05cc4bc9";

      } else {
        doc[i].style.background = "linear-gradient(30deg, #00d2ff 0%, #3a47d5 100%)";
        btnDoc[i].style.background = "#0565cc";

      }
    }
  }
  
}
  
  