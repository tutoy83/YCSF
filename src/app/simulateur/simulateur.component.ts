import { Component } from '@angular/core';

interface Stage {
  nom: string;
  prix: number;
}

interface StageDemande {
  nom: string;
  prixPublic: number;
  prixRemise: number;
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
    { nom: 'Dériveur (Vago/laser)', prix: 140},
    { nom: 'Multi-Activités', prix: 130},
  ];


  commande: { [nom: string]: number } = {};


  total: number = 0;

  stagesDemandesArr: StageDemande[] = [];


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

  totalCalc(): number {
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
            alert('y');
            this.total += stage1.prixPublic + stage2.prixRemise + stage3.prixPublic;
        }else if ((stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak') && stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak' && stage3.nom !== 'Moussaillons' && stage3.nom !== 'Kayak') {
            //INTERDIT - NORMAL - NORMAL
            alert("INTERDIT - NORMAL - NORMAL");
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
        alert("ttt - NORMAL - NORMAL");

          const stagesSortedByPrice = this.stagesDemandesArr.sort((a, b) => b.prixPublic - a.prixPublic);
          stagesSortedByPrice[0].prixRemise = stagesSortedByPrice[0].prixPublic * 0.9;
          stagesSortedByPrice[1].prixRemise = stagesSortedByPrice[1].prixPublic * 0.95;
          this.total += stagesSortedByPrice[0].prixRemise + stagesSortedByPrice[1].prixRemise + stagesSortedByPrice[2].prixPublic;
      }
  }


    console.log("Fin total", this.stagesDemandesArr);
    return this.total;
  }
  
  

  reset(): void{
    this.stagesDemandesArr = [];
  }
  
}
  
  