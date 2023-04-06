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
    { nom: 'Multi', prix: 130},
    { nom: 'Cotisation Club', prix: 19},
    { nom: 'Passeport Voile', prix: 12},
  ];


  commande: { [nom: string]: number } = {};


  total: number = 0;

  stagesDemandesArr: StageDemande[] = [];


  ajouterStageDemande(stage: Stage): void {
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
  }

  totalCalc(): number {
    let total = 0;
    const nbStages = this.stagesDemandesArr.length;
  
    if (nbStages === 0) {
      return total;
    } else if (nbStages === 1) {
      return this.stagesDemandesArr[0].prixRemise;
    } else if (nbStages === 2) {
      const stage1 = this.stagesDemandesArr[0];
      const stage2 = this.stagesDemandesArr[1];
      const moussaillonsOuKayak = stage1.nom === 'Moussaillons' || stage1.nom === 'Kayak' || stage2.nom === 'Moussaillons' || stage2.nom === 'Kayak';
  
      if (moussaillonsOuKayak) {
        if (stage1.nom !== 'Moussaillons' && stage1.nom !== 'Kayak') {
            stage1.prixRemise = stage1.prixPublic * 0.95;
            total += stage1.prixRemise;
        } else if (stage2.nom !== 'Moussaillons' && stage2.nom !== 'Kayak') {
            stage2.prixRemise = stage2.prixPublic * 0.95;
            total += stage2.prixRemise;
        } else {
            total += stage1.prixPublic + stage2.prixPublic;
        }
    } else {
        const stageAvecPrixPlusGrand = stage1.prixPublic > stage2.prixPublic ? stage1 : stage2;
        const stageAvecPrixPlusPetit = stage1.prixPublic > stage2.prixPublic ? stage2 : stage1;
      
        stageAvecPrixPlusGrand.prixRemise = stageAvecPrixPlusGrand.prixPublic * 0.95;
        total += stageAvecPrixPlusGrand.prixRemise;
        total += stageAvecPrixPlusPetit.prixPublic;
    }
    
    }
    console.log("Fin total", this.stagesDemandesArr);
    return total;
  }
  
  

  reset(): void{
    this.stagesDemandesArr = [];
  }
  
}
  
  