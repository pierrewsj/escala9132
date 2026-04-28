const CONFIG = {
  mes: '09/2025',
  equipe: '9132',
  turno: '1º Turno',
  titulo: 'Escala de Trabalho - Equipe 9132'
};

const LEGENDA = {
  '71': 'Caixaria Pátio Central/G89',
  '72': 'JIT G4',
  'G15': 'Ilha Ecológica',
  'G38': 'Ilha Ecológica',
  '69': 'A confirmar / última posição da escala',
  '70': 'A confirmar / última posição da escala',
  '73': 'A confirmar / última posição da escala',
  '74': 'A confirmar / última posição da escala',
  '75': 'A confirmar / última posição da escala',
  '76': 'A confirmar / última posição da escala',
  '77': 'A confirmar / última posição da escala',
  'G76': 'Expedição vasilhame Galpão 76',
  '66AU': 'G9 FTP',
  'INT-89': 'Interne G89',
  'FPT/CX': 'Caixaria G8 FPT',
  'CMP': 'A confirmar / última posição da escala',
  'RÁDIO': 'Disponível para demandas da Central Seg.',
  'Pens.': 'Pensão / folga conforme escala'
};

const CICLO = ['69','72','74','INT-89','77','CMP','73','66AU','70','75','71','76','G76','RÁDIO','FPT/CX'];
function cicloAPartir(inicio, qtd = 31) {
  const i = CICLO.indexOf(inicio);
  const start = i >= 0 ? i : 0;
  return Array.from({ length: qtd }, (_, n) => CICLO[(start + n) % CICLO.length]);
}

const ESCALA = [
  { nome: 'VANDER', dias: Array(31).fill('G15') },
  { nome: 'PIERRE', dias: Array(31).fill('G38') },
  { nome: 'DANIEL', dias: Array(31).fill('Pens.') },
  { nome: 'POLIANA S.', dias: Array(31).fill('Pens.') },
  { nome: 'VIANA', dias: Array(31).fill('Pens.') },
  { nome: 'JULIANO', dias: cicloAPartir('69') },
  { nome: 'AIMEN', dias: cicloAPartir('72') },
  { nome: 'CARLOS', dias: cicloAPartir('74') },
  { nome: 'GINALDO', dias: cicloAPartir('INT-89') },
  { nome: 'JAIR', dias: cicloAPartir('77') },
  { nome: 'DORIEL', dias: cicloAPartir('CMP') },
  { nome: 'POLIANA G.', dias: cicloAPartir('73') },
  { nome: 'RENATO', dias: cicloAPartir('66AU') },
  { nome: 'MAXILENE', dias: cicloAPartir('70') },
  { nome: 'ADRIANA', dias: cicloAPartir('75') },
  { nome: 'ALEXANDRE', dias: cicloAPartir('71') },
  { nome: 'REGINALDO', dias: cicloAPartir('76') },
  { nome: 'AMANDA', dias: cicloAPartir('G76') },
  { nome: 'FABIANA', dias: cicloAPartir('RÁDIO') },
  { nome: 'CINTIA', dias: cicloAPartir('FPT/CX') }
];
