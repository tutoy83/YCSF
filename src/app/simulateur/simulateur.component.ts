import { Component } from '@angular/core';

interface Stage {
  nom: string;
  prix: number;
  quantite: number;
  total: number;
}

interface LigneRecapitulatif {
  nom: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

@Component({
  selector: 'app-simulateur',
  templateUrl: './simulateur.component.html',
  styleUrls: ['./simulateur.component.css']
})
export class SimulateurComponent {

  stages: Stage[] = [
    { nom: ' Moussaillons', prix: 121, quantite: 0, total: 0 },
    { nom: 'OptiMouss', prix: 118, quantite: 0, total: 0 },
    { nom: 'Optimist', prix: 118, quantite: 0, total: 0 },
    { nom: 'Kayak', prix: 97, quantite: 0, total: 0 },
    { nom: 'Planche Ados', prix: 135, quantite: 0, total: 0 },
    { nom: 'Catamaran Ados', prix: 146, quantite: 0, total: 0 },
    { nom: 'Catamaran Adultes', prix: 174, quantite: 0, total: 0 },
    { nom: 'Planche Adultes', prix: 145, quantite: 0, total: 0 },
    { nom: 'Multi', prix: 130, quantite: 0, total: 0 },
    { nom: 'TEST', prix: 0, quantite: 0, total: 0 },
    { nom: 'Cotisation Club', prix: 19, quantite: 0, total: 0 },
    { nom: 'Passeport Voile', prix: 12, quantite: 0, total: 0 },
  ];


  commande: { [nom: string]: number } = {};

  recapitulatif: LigneRecapitulatif[] = [];

  total: number = 0;

  reset(): void {
    this.stages.forEach(stage => {
      stage.quantite = 0;
      stage.total = 0;
    });
    this.commande = {};
    this.recapitulatif = [];
    this.total = 0;
  }

  ajouterStage(stage: Stage): void {
    if (this.commande[stage.nom]) {
      this.commande[stage.nom]++;
    } else {
      this.commande[stage.nom] = 1;
    }
    this.calculerTotal();
  }

  enleverStage(stage: Stage): void {
    if (this.commande[stage.nom]) {
      this.commande[stage.nom]--;
      if (this.commande[stage.nom] === 0) {
        delete this.commande[stage.nom];
      }
      this.calculerTotal();
    }
  }

  getQuantite(stage: Stage): number {
    return this.commande[stage.nom] || 0;
  }

  calculerTotal(): void {
    let stage1 = 0; // prix pour le stage le plus cher
    let stage2 = 0; // prix pour le deuxième stage le plus cher
    let stage3 = 0; // prix pour le troisième stage le plus cher
    let reduction2 = 0.05; // réduction de 5% pour le deuxième stage
    let reduction3 = 0.10; // réduction de 10% pour le troisième stage
  
    // On recherche les trois stages les plus chers
    for (let stage of this.stages) {
      if (this.commande[stage.nom]) {
        if (stage.prix > stage1) {
          stage3 = stage2;
          stage2 = stage1;
          stage1 = stage.prix;
        } else if (stage.prix > stage2) {
          stage3 = stage2;
          stage2 = stage.prix;
        } else if (stage.prix > stage3) {
          stage3 = stage.prix;
        }
      }
    }
  
    // Calcul du total pour chaque stage avec les réductions éventuelles
    for (let stage of this.stages) {
      if (this.commande[stage.nom]) {
        if (stage.prix === stage1) {
          stage.total = stage1 * this.commande[stage.nom];
        } else if (stage.prix === stage2) {
          stage.total = stage2 * this.commande[stage.nom] * (1 - reduction2);
        } else if (stage.prix === stage3) {
          stage.total = stage3 * this.commande[stage.nom] * (1 - reduction3);
        }
        this.total += stage.total;
      }
    }
  
    // Affichage des stages pris avec leur quantité, leur prix unitaire et leur prix total
    this.recapitulatif = [];
    for (let stage of this.stages) {
      if (this.commande[stage.nom]) {
        let reduction = 0;
        if (stage.prix === stage2) {
          reduction = reduction2 * 100;
        } else if (stage.prix === stage3) {
          reduction = reduction3 * 100;
        }
        let ligne = { 
          nom: stage.nom,
          quantite: this.commande[stage.nom],
          prixUnitaire: stage.prix,
          prixTotal: stage.total,
        };
        this.recapitulatif.push(ligne);
      }
    }
  
    // Affichage du total général
    this.recapitulatif.push({
      nom: 'Total',
      quantite: 0,
      prixUnitaire: 0,
      prixTotal: this.total,
    });
  }
}
  