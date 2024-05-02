//Parent Sprit Classa

class Sprite {
    constructor(sprite_json, start_state) {
        this.sprite_json = sprite_json;

        this.position = createVector(random(width), random(height));

        this.state = start_state;
        this.root_e = "TenderBud";

        this.cur_frame = 0;

        this.cur_bk_data = null;

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.maxForce = 0.2;
        this.maxSpeed = 5;
        this.acceleration = createVector();
        //this.clear = false

    }

    draw(state) {
        var ctx = canvas.getContext('2d');
        //console.log(this.sprite_json[this.root_e][this.state][this.cur_frame]['w']);
        //console.log(state['key_change']);

        if (this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] == null) {
            console.log("loading");
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'] = new Image();
            this.sprite_json[this.root_e][this.state][this.cur_frame]['img'].src = 'Penguins/' + this.root_e + '/' + this.state + '/' + this.cur_frame + '.png';
        }

        // if (this.cur_bk_data != null) {
        //     ctx.putImageData(this.cur_bk_data, (this.position.x - this.velocity.x), (this.position.y - this.velocity.y));
        // }

        // this.cur_bk_data = ctx.getImageData(this.position.x, this.position.y,
        //     this.sprite_json[this.root_e][this.state][this.cur_frame]['w'],
        //     this.sprite_json[this.root_e][this.state][this.cur_frame]['h']);


        ctx.drawImage(this.sprite_json[this.root_e][this.state][this.cur_frame]['img'], this.position.x, this.position.y);

        this.cur_frame = this.cur_frame + 1;
        if (this.cur_frame >= this.sprite_json[this.root_e][this.state].length) {
            //console.log(this.cur_frame);
            //console.log("reset");
            this.cur_frame = 0;
        }

        if (this.position.x >= (window.innerWidth - this.sprite_json[this.root_e][this.state][this.cur_frame]['w'])) {
            this.bound_hit('E');
        } else if (this.position.x <= 0) {
            this.bound_hit('W');
        } else if (this.position.y >= (window.innerHeight - this.sprite_json[this.root_e][this.state][this.cur_frame]['h'])) {
            this.bound_hit('S');
        } else if (this.position.y <= 0) {
            this.bound_hit('N');
        } else {
            this.position.x = this.position.x + this.velocity.x;
            this.position.y = this.position.y + this.velocity.y;
        }

        return false;

    }

    // set_idle_state() {
    //     this.velocity.x = 0;
    //     this.velocity.y = 0;
    //     this.cur_frame = 0;
    //     const idle_state = ["idle", "idleBackAndForth", "idleBreathing", "idleFall", "idleLayDown", "idleLookAround", "idleLookDown", "idleLookLeft", "idleLookRight", "idleLookUp", "idleSit", "idleSpin", "idleWave"];

    //     const random = Math.floor(Math.random() * idle_state.length);
    //     console.log(idle_state[random]);
    //     this.state = idle_state[random];
    //     console.log(idle_state[random]);
    // }

    // edges() {
    //     if (this.position.x > width) {
    //         this.position.x = 0;
    //     } else if (this.position.x < 0) {
    //         this.position.x = width;
    //     }
    //     if (this.position.y > height) {
    //         this.position.y = 0;
    //     } else if (this.position.y < 0) {
    //         this.position.y = height;
    //     }
    // }
    bound_hit(side) {
        // this.set_idle_state();
        //console.log(side);

        if (side === 'E')
            this.position.x = 10
        else if (side === 'W')
            this.position.x = window.innerWidth - 200
        else if (side === 'N')
            this.position.y = window.innerHeight - 200
        else if (side === 'S')
            this.position.y = 10

        this.clear = true
    }

    align(boids) {
        let perceptionRadius = 125;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    separation(boids) {
        let perceptionRadius = 24;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 150;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids) {
        // let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        // alignment.mult(alignSlider.value());
        // cohesion.mult(cohesionSlider.value());
        // separation.mult(separationSlider.value());

        // this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(6);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}
