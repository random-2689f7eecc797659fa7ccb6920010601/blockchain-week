import { ScenarioData } from '../types';
import {
  SC01_AccessControl,
  SC03_LogicError,
  SC05_Reentrancy
} from './Simulations';

export const SCENARIOS: ScenarioData[] = [
  {
    id: 'sc01',
    title: 'Access Control - Хандалтын Хяналт',
    shortTitle: 'Access Control',
    description: `
## Үндсэн Ойлголт

**Access Control** буюу хандалтын хяналт нь "Хэн юу хийж чадах вэ?" гэсэн асуултад хариулдаг. Smart Contract-д зөвхөн тодорхой эрхтэй хаягууд (Owner, Admin) хийх ёстой үйлдлүүд байдаг.

## Халдлагын Зарчим

Хакерууд хамгаалалтгүй функцүүдийг хайж олоод, тэдгээрийг дуудаж системийн эрхийг авдаг. Жишээ нь initVault(), setOwner() гэх мэт функцүүд.

## Бодит Кейс

**Radiant Capital (2024)** - Multisig wallet-ийн эрхийг шилжүүлэх функц хамгаалалтгүй байсан. Хакерууд $50 сая долларыг хулгайлсан.
    `,
    attackTypes: [
      {
        id: 'ac1',
        name: 'Access Control байхгүй',
        nameEn: 'Missing Access Control',
        description: 'Функцэнд ямар ч хамгаалалт байхгүй. Хэн ч дуудаж, чухал үйлдэл хийж чадна.',
        example: 'function setOwner(address _new) public { owner = _new; }',
        severity: 'critical'
      },
      {
        id: 'ac2',
        name: 'Буруу нөхцөл / Буруу Role шалгалт',
        nameEn: 'Incorrect Condition / Wrong Role Checking',
        description: 'Хамгаалалт байгаа ч, нөхцөл буруу бичигдсэн эсвэл буруу role шалгаж байна.',
        example: 'require(msg.sender != owner); // Буруу! == байх ёстой',
        severity: 'critical'
      },
      {
        id: 'ac3',
        name: 'Delegatecall Access Control алдаа',
        nameEn: 'Delegatecall Access Control Failure',
        description: 'Delegatecall ашиглах үед context (msg.sender, storage) өөрчлөгддөг. Энэ нь access control-ийг алгасах боломж үүсгэдэг.',
        example: 'target.delegatecall(data); // msg.sender хадгалагдана, storage өөрчлөгдөнө',
        severity: 'critical'
      },
      {
        id: 'ac4',
        name: 'Owner-ийг буруу эхлүүлэх',
        nameEn: 'Ownership Takeover / Incorrect Owner Initialization',
        description: 'Constructor эсвэл init функцэд owner буруу тохируулсан, эсвэл дахин дуудах боломжтой үлдсэн.',
        example: 'function init() public { owner = msg.sender; } // Хэн ч дуудаж болно!',
        severity: 'critical'
      },
      {
        id: 'ac5',
        name: 'Чухал функцэнд Role хязгаарлалт байхгүй',
        nameEn: 'Missing Role Restriction on Critical Functions',
        description: 'Мөнгө татах, тохиргоо өөрчлөх гэх мэт чухал функцүүдэд onlyOwner эсвэл onlyAdmin байхгүй.',
        example: 'function withdrawAll() public { ... } // onlyOwner modifier байхгүй',
        severity: 'high'
      },
      {
        id: 'ac6',
        name: 'Эрх дээшлүүлэх',
        nameEn: 'Role Escalation (Privilege Escalation)',
        description: 'Бага эрхтэй хэрэглэгч өөрийн эрхийг дээшлүүлж, админ болох боломжтой.',
        example: 'function grantRole(role) public { roles[msg.sender] = role; }',
        severity: 'critical'
      }
    ],
    realCase: {
      name: 'Radiant Capital Hack',
      year: '2024',
      description: 'Олон гарын үсэгт (Multisig) түрийвчний эрхийг шилжүүлэх функц дээр хяналт сул байснаас болж хакерууд удирдлагыг гартаа авч, $50 сая долларыг өөрсдийн түрийвч рүү шилжүүлсэн.',
      loss: '$50,000,000'
    },
    vulnerableCode: `contract VulnerableVault {
    address public owner;

    // ❌ AC1: Missing Access Control
    function initVault() public {
        owner = msg.sender;
    }

    // ❌ AC5: Missing Role Restriction
    function withdrawAll() public {
        require(msg.sender == owner, "Not Owner");
        payable(msg.sender).transfer(address(this).balance);
    }

    // ❌ AC6: Role Escalation
    function grantAdmin(address user) public {
        admins[user] = true;
    }
}`,
    component: SC01_AccessControl
  },
  {
    id: 'sc02',
    title: 'Logic Errors - Логикийн Алдаа',
    shortTitle: 'Logic Errors',
    description: `
## Үндсэн Ойлголт

**Logic Error** буюу логикийн алдаа нь код зөв compile хийгдэж, ажиллаж байгаа ч бизнесийн логик буруу үр дүнд хүргэдэг алдаа юм. Solidity бутархай тоо дэмждэггүй тул тооцоолол онцгой анхаарал шаарддаг.

## Халдлагын Зарчим

Хакерууд системийн логикийн сул талыг ашиглан өөрт ашигтай нөхцөл бий болгодог. Жишээ нь: тооцооллын алдааг ашиглах, state-ийн буруу таамаглалыг ашиглах.

## Бодит Кейс

**Prisma Finance (2024)** - Integer division алдаанаас болж $11 сая алдагдсан. Хакер барьцаа хөрөнгийг дутуу үнэлүүлж, илүү мөнгө гаргаж авсан.
    `,
    attackTypes: [
      {
        id: 'le1',
        name: 'Буруу Validation / Шалгалт дутуу',
        nameEn: 'Incorrect Validation / Missing Sanity Checks',
        description: 'Input утгуудыг зөв шалгаагүй. Хязгаар, тэг хуваалт, хоосон утга гэх мэт.',
        example: 'function div(a, b) { return a / b; } // b=0 шалгаагүй!',
        severity: 'high'
      },
      {
        id: 'le2',
        name: 'Үйлдлийн буруу дараалал',
        nameEn: 'Incorrect Order of Operations',
        description: 'Үйлдлүүдийн дараалал буруу бол үр дүн өөрчлөгдөнө. Жишээ: хуваахаас өмнө үржих.',
        example: '(amount / total) * rate; // amount < total бол 0 болно',
        severity: 'critical'
      },
      {
        id: 'le3',
        name: 'Математик & Бүртгэлийн зөрүү',
        nameEn: 'Math Logic & Accounting Inconsistency',
        description: 'Дотоод бүртгэл (internal accounting) болон бодит үлдэгдэл хоорондоо таарахгүй байх.',
        example: 'totalSupply += amount; // Бодит token илгээхгүйгээр supply нэмэгдсэн',
        severity: 'critical'
      },
      {
        id: 'le4',
        name: 'State-ийн буруу таамаглал',
        nameEn: 'Incorrect Assumptions About State',
        description: 'Contract-ийн төлөв үргэлж тодорхой байна гэж буруу таамагласан.',
        example: 'require(balance > 0); // Flash loan байх үед буруу',
        severity: 'high'
      },
      {
        id: 'le5',
        name: 'Permission логикийн алдаа',
        nameEn: 'Incorrect Permission or Role Logic',
        description: 'Access control биш, харин эрхийн логик буруу. Жишээ: AND/OR буруу ашигласан.',
        example: 'if (isAdmin || isOwner) // && байх ёстой байсан бол?',
        severity: 'high'
      },
      {
        id: 'le6',
        name: 'Бизнес логикийн exploit',
        nameEn: 'Business Logic Exploits (Economic Logic Flaws)',
        description: 'Эдийн засгийн логик буруу. Oracle manipulation, flash loan attack гэх мэт.',
        example: 'price = reserve0 / reserve1; // Flash loan-оор reserve өөрчилж болно',
        severity: 'critical'
      },
      {
        id: 'le7',
        name: 'State Machine логикийн алдаа',
        nameEn: 'State Machine Logic Error',
        description: 'Төлөв шилжилтийн логик буруу. Жишээ: pending → completed руу шууд орох.',
        example: 'status = Status.Completed; // Pending шалгаагүй!',
        severity: 'high'
      },
      {
        id: 'le8',
        name: 'Return утга шалгаагүй',
        nameEn: 'Unchecked Return Values',
        description: 'Функцийн буцаах утгыг шалгаагүйгээс болж алдаа мэдэгдэхгүй өнгөрдөг.',
        example: 'token.transfer(to, amount); // bool буцаадаг ч шалгаагүй',
        severity: 'high'
      }
    ],
    realCase: {
      name: 'Prisma Finance',
      year: '2024',
      description: 'Prisma Finance-ийн гэрээнд өрийг шилжүүлэх үед нарийн тооцооллын алдаа гарсан. Хакер үүнийг ашиглан барьцаа хөрөнгийг дутуу үнэлүүлж, системээс илүү мөнгө гаргаж авсан.',
      loss: '$11,000,000'
    },
    vulnerableCode: `function calculateReward(uint amount) public {
    uint total = 1000;
    uint rate = 50;

    // ❌ LE2: Incorrect Order of Operations
    uint reward = (amount / total) * rate;

    // ✅ ЗӨВ: (amount * rate) / total;
}

function transfer(address to, uint amount) {
    // ❌ LE8: Unchecked Return Value
    token.transfer(to, amount);

    // ✅ ЗӨВ: require(token.transfer(to, amount), "Failed");
}

function getPrice() public view returns (uint) {
    // ❌ LE6: Business Logic Exploit
    return reserveA / reserveB;
}`,
    component: SC03_LogicError
  },
  {
    id: 'sc03',
    title: 'Reentrancy - Дахин Нэвтрэх',
    shortTitle: 'Reentrancy',
    description: `
## Үндсэн Ойлголт

**Reentrancy** буюу дахин нэвтрэх халдлага нь Smart Contract гадны хаяг руу дуудлага хийх үед хяналтаа алддаг шинж чанарыг ашигладаг. Хүлээн авагч contract нь fallback функцээрээ анхны contract руу буцаж дуудаж, state шинэчлэгдэхээс өмнө үйлдэл давтах боломжтой.

## Халдлагын Зарчим

1. Халдагч withdraw() дуудна
2. Contract ETH илгээнэ (balance хасагдаагүй!)
3. Халдагчийн fallback() ажиллаж, дахин withdraw() дуудна
4. Contract дахин ETH илгээнэ (balance мөн л хасагдаагүй!)
5. Банк хоосортол давтагдана

## Бодит Кейс

**The DAO (2016)** - Ethereum-ийн түүхэн дэх хамгийн том халдлага. $60 сая алдагдсан. Ethereum-ийг hard fork хийхэд хүргэсэн.
    `,
    attackTypes: [
      {
        id: 're1',
        name: 'Single-function Reentrancy',
        nameEn: 'Single-function Reentrancy',
        description: 'Нэг функц дотор state update хийхээс өмнө external call хийж, мөн тэр функцийг дахин дуудах.',
        example: 'withdraw() → call{value} → fallback() → withdraw() again',
        severity: 'critical'
      },
      {
        id: 're2',
        name: 'Cross-function Reentrancy',
        nameEn: 'Cross-function Reentrancy',
        description: 'Нэг функцээс external call хийгээд, өөр функц руу дахин нэвтэрч shared state-ийг ашиглах.',
        example: 'withdraw() → external call → transfer() uses shared balances',
        severity: 'critical'
      },
      {
        id: 're3',
        name: 'Cross-contract Reentrancy',
        nameEn: 'Cross-contract Reentrancy',
        description: 'Олон contract хоорондын shared state ашиглан reentrancy хийх. Жишээ: Token + DEX.',
        example: 'DEX.swap() → Token.transfer() → callback to DEX',
        severity: 'critical'
      },
      {
        id: 're4',
        name: 'Read-only Reentrancy',
        nameEn: 'Read-only Reentrancy (2023-2024)',
        description: 'State өөрчилдөггүй ч, view функцүүд буруу утга буцааж, бусад contract-д нөлөөлөх. Curve, Balancer-т илэрсэн.',
        example: 'getPrice() returns stale value during reentrancy',
        severity: 'high'
      }
    ],
    realCase: {
      name: 'Curve Finance / Vyper Exploit',
      year: '2023',
      description: 'Vyper compiler-ийн reentrancy lock-ийн алдаанаас болж Curve Finance-ийн хэд хэдэн pool-оос $70 сая гаруй алдагдсан. Read-only reentrancy pattern ашигласан.',
      loss: '$70,000,000+'
    },
    vulnerableCode: `// ❌ RE1: Single-function Reentrancy
function withdraw() public {
    uint bal = balances[msg.sender];
    require(bal > 0);

    // INTERACTION before EFFECT - WRONG!
    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed");

    // Too late! Attacker already re-entered
    balances[msg.sender] = 0;
}

// ❌ RE4: Read-only Reentrancy
function getVirtualPrice() public view returns (uint) {
    return totalSupply * 1e18 / totalBalance;
}

// ✅ FIX: Checks-Effects-Interactions Pattern
function withdrawSecure() public {
    uint bal = balances[msg.sender];
    require(bal > 0);

    balances[msg.sender] = 0; // EFFECT first!

    (bool sent, ) = msg.sender.call{value: bal}("");
    require(sent, "Failed");
}`,
    component: SC05_Reentrancy
  }
];
