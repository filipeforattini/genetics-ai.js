# genetics-ai.js

## Installation

```bash
npm install genetics-ai
```

## Genetics AI

Here we will use the `DNA` (now replaced as `genome`) to refer to the `Genetics AI` configuration.

The `gnome` is a sequence of `bases` that may be `connections` or `biases` type.

The connections are the links between `sensors`, `neurons` and `actions`, and the `biases` are the `neurons` and `actions` bias.

### Start

You will have to extend the `Individual` class and implement the `fitness` method.

```js
import { Individual } from 'genetics-ai'

class Car extends Individual {
  constructor(...args) {
    super(...args)
    this.health = 100
  }
  fitness() {
    return this.health / 100
  }
}
```

## The genome structure

The `genome` is a sequence of `bases` as a sequence of 3 or 5 digits.

Each digit is a `base 32` number to make the `genome` more compact. To explore the most of the data structure, we will use the binary of its digits.

### Bases definition

```js
const base = "000"
```

| config | target      |
|-------:|------------:|
|      0 |          00 |
|  00000 | 00000 00000 |

<pre>
  config   | data
 0 0 0 0 0 | 0 0 0 0 0   0 0 0 0 0
 |-----| |
 |       base type
 |       0 - connection
 |       1 - bias
 saved data
</pre>


### Connections Bases

This is the base that connects `sensors`, `neurons` and `actions`.

It has 5 digits, the first one is the `config`, the second and third ones are the `source` and the fourth and fifth ones are the `target`.


#### Example 1

```js
const base = "00000"
```

| config | source      | target      |
|-------:|------------:|------------:|
|      0 |          00 |          00 |
|  00000 | 00000 00000 | 00000 00000 |

Sources can be `sensors` (0) or `neurons` (1).

Targets can be `neurons` (0) or `actions` (1).

<pre>
 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0
 |-----| |
 |       base type = 0   --> type = connection
 aditional data = 0000   --> weight = 0

 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0
             |---------------| |
             |                 source type = 0   --> source = sensor
             |                 0 - sensor
             |                 1 - neuron
             source id = 000000000               --> sensor id = 0

 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0   0 0 0 0 0 0 0 0 0 0
                                   |---------------| |
                                   |                 target type = 0   --> target = neuron
                                   |                 0 - neuron
                                   |                 1 - action
                                   target id                           --> neuron id = 0
</pre>

#### Example 2

```js
const base = "A0B0C"
```

| config | source      | target |
|-------:|------------:|------------:|
|      A |          0B |          0C |
|  01010 | 00000 01011 | 00000 01100 |

<pre>
 0 1 0 1 0   0 0 0 0 0 0 1 0 1 1   0 0 0 0 0 0 1 1 0 0
 |-----| |
 |       base type = 0   --> type = connection
 aditional data = 0101   --> weight = 5

 0 1 0 1 0   0 0 0 0 0 0 1 0 1 1   0 0 0 0 0 0 1 1 0 0
             |---------------| |
             |                 source type = 1   --> source = neuron
             source id = 000000101               --> source id = 5

 0 1 0 1 0   0 0 0 0 0 0 1 0 1 1   0 0 0 0 0 0 1 1 0 0
                                   |---------------| |
                                   |                 target type = 0  --> target = neuron
                                   target id = 000000110              --> target id = 6
</pre>

### Connections Bases Limits

You may have at most:
- 512 `Sensors`
- 512 `Neurons`
- 512 `Actions`

The `weight` is between [0, 15].

| config | source      | target |
|-------:|------------:|------------:|
|      U |          VU |          VU |
|  11110 | 11111 11110 | 11111 11110 |
|      U |          VV |          VV |
|  11110 | 11111 11111 | 11111 11111 |

Highest sensor into the highest neuron:

<pre>
 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0
 |-----| |
 |       base type = 0   --> type = connection
 aditional data = 1111   --> weight = 15

 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0
             |---------------| |
             |                 source type = 0   --> source = sensor
             source id = 111111111               --> source id = 511

 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0   1 1 1 1 1 1 1 1 1 0
                                   |---------------| |
                                   |                 target type = 0  --> target = neuron
                                   target id = 111111111              --> target id = 512
</pre>

Highest neuron into the highest action:

<pre>
 1 1 1 1 0   1 1 1 1 1 1 1 1 1 1   1 1 1 1 1 1 1 1 1 1
 |-----| |
 |       base type = 0   --> type = connection
 aditional data = 1111   --> weight = 15

 1 1 1 1 0   1 1 1 1 1 1 1 1 1 1   1 1 1 1 1 1 1 1 1 1
             |---------------| |
             |                 source type = 1   --> source = neuron
             source id = 111111111               --> source id = 511

 1 1 1 1 0   1 1 1 1 1 1 1 1 1 1   1 1 1 1 1 1 1 1 1 1
                                   |---------------| |
                                   |                 target type = 0  --> target = action
                                   target id = 111111111              --> target id = 512
</pre>


### Bias Bases

This base set the bias of a `sensor`, `neuron` or `action`.

It has 3 digits, the first one is the `config`, the second and third ones are the `target`.

Bias bases are accumulative!

```js
const base = "100"
```

| config | target      |
|-------:|------------:|
|      1 |          00 |
|  00001 | 00000 00000 |


<pre>
 0 0 0 0 1   0 0 0 0 0 0 0 0 0 0
 |---| | |
 |     | base type = 0   --> type = connection
 |     | 0 - connection
 |     | 1 - bias
 |     negative sign     --> positive = 0
 |     0 - positive
 |     1 - negative
 aditional data = 000    --> bias = 0

 0 0 0 0 1   0 0 0 0 0 0 0 0 0 0
             |-------------| |-|
             |                 |
             |                 target type = 00   --> target = sensor
             |                 00 - sensor
             |                 01 - neuron
             |                 10 - action
             |                (11 - neuron)
             target id = 00000000                 --> sensor id = 0
</pre>


### Bias Bases Limits

You may set bies at most:
- 255 `Sensors`
- 255 `Neurons`
- 255 `Actions`

The `bias` is between [-7, 7].

| config | target      |          |
|-------:|------------:|:----------------------------|
|      V |          VS | bias with -7 for sensor 255 | 
|  11111 | 11111 11100 |
|      V |          VT |
|  11111 | 11111 11101 |
|      V |          VU |
|  11111 | 11111 11110 |
|      V |          VV |
|  11111 | 11111 11111 |

<pre>
 1 1 1 1 0   1 1 1 1 1 1 1 1 0 0
 |---| | |
 |     | base type = 0   --> type = bias
 |     negative sign     --> negative = 1
 aditional data = 111    --> bias = -7

 1 1 1 1 0   1 1 1 1 1 1 1 1 0 0
             |-------------| |-|
             |                 target type = 00   --> target = sensor
             target id = 11111111                 --> target id = 255
</pre>


## Appendix

### Base 32 table

| b10 | b32 | bin   |
|:---:|:---:|:-----:|
|  0  |  0  | 00000 |
|  1  |  1  | 00001 |
|  2  |  2  | 00010 |
|  3  |  3  | 00011 |
|  4  |  4  | 00100 |
|  5  |  5  | 00101 |
|  6  |  6  | 00110 |
|  7  |  7  | 00111 |
|  8  |  8  | 01000 |
|  9  |  9  | 01001 |
| 10  |  A  | 01010 |
| 11  |  B  | 01011 |
| 12  |  C  | 01100 |
| 13  |  D  | 01101 |
| 14  |  E  | 01110 |
| 15  |  F  | 01111 |
| 16  |  G  | 10000 |
| 17  |  H  | 10001 |
| 18  |  I  | 10010 |
| 19  |  J  | 10011 |
| 20  |  K  | 10100 |
| 21  |  L  | 10101 |
| 22  |  M  | 10110 |
| 23  |  N  | 10111 |
| 24  |  O  | 11000 |
| 25  |  P  | 11001 |
| 26  |  Q  | 11010 |
| 27  |  R  | 11011 |
| 28  |  S  | 11100 |
| 29  |  T  | 11101 |
| 30  |  U  | 11110 |
| 31  |  V  | 11111 |