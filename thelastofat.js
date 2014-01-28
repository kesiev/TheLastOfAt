//      _____ _____ _____
//     |_   _|  |  |   __|
//       | | |     |   __|
//       |_| |__|__|_____|
//      __    _____ _____ _____
//     |  |  |  _  |   __|_   _|
//     |  |__|     |__   | | |
//     |_____|__|__|_____| |_|
//      _____ _____
//     |     |   __|
//     |  |  |   __|
//     |_____|__|
//      _____ _____
//     |  _  |_   _|
//     |     | | |
//     |__|__| |_|	
//
//
// *"The Last Of At" - A Fanfictional Tribute Survival Roguelike in 1K of JS
// By [KesieV](http://www.kesiev.com) (c) 2014*
//
//
// A mysterious mushroom infected humanity and is turning it in a deadly horde
// of zombies!
// But there's still hope: with the right amount of mushroom roots, extracted
// from a certain type of zombie, a vaccine can be synthetized!
// With the help of Dollie, your surprisingly zombie-immune young partner,
// you'll start your deadly journey in the ultimate attempt to save humanity!
//
// Move Joet `@` with arrows. Dollie `$`, your partner, will follow you. Avoid
// or kill weak `1-2`, medium `3-4`) or strong zombies `5-6-7-8-9` and reach
// the next zone `^`.
// Collect bandages `+` to gain HP, knives `/` to kill strong zombies in one hit
// and vials `U` to increase your score.
//
// Your mission is to collect mushroom root vials you can obtain cutting them
// from strong zombies only.
// You've to hunt them so explore each zone, look for an exit to the next one
// and try to not get killed.
// You can damage zombies hitting them, dealing 1 damage point. When a zombie
// reaches 0 it will die. Zombies killed with standard attacks could drop a
// bandage or a knife.
//
// The knife kills strong zombies in one hit: a strong zombie always drops
// something, such as another knife, a bandage or a mushroom root vial.
// Collect them! Humanity depends on you!
//
// Zombies can attack you too and they will deal as much damage as their size so
// face zombies carefully. Strong and medium zombies are blind and they will
// move randomly but weak zombies are able to hear you!
// You won't be alone: Dollie will follow you, covering your back since she's
// immune of zombies but keep in mind that you can't displace her - especially
// in narrow corridors!
//
// Good luck!
//
// ---
//
// **Features:**
//
// * An open mini-roguelike in 1024 bytes of uncrushed T-shirt friendly JS!
// * Randomized maps with rooms and corridors!
// * Generates floors or caves with obstacles or empty rooms!
// * Progressive complexity of the map and number of enemies!
// * Raycasting!
// * Enemies with different size and classes!
// * Simple combat system!
// * Inventory!
// * Knives, bandages and vials to pick up!
// * In-game narration and dramatic turn of events! (?!)
// * Game ending!
// * Dollie will help (or bug) you!
//
// ---
//
// **Thanks to:**
//
// * Lucio "Posixe" Maitti for introducing me to roguelikes ages ago.
// * [Hack, Slash, Loot](http://hackslashloot.com/) for inspiration.
// * [uglifyjs](https://github.com/mishoo/UglifyJS) for teaching me techniques.
// * [Shouting Hard](http://www.claudiocc.com/javascript-golfing/) for basics.
// * Bianca for her HEAVY support and feature suggestions.
// * [Naughty Dog](http://www.naughtydog.com/) for their masterpiece
//   [The Last Of Us](http://www.thelastofus.playstation.com/).
//
// ---
//
// **One More Thing:**
//
// Play this game [here](http://www.kesiev.com/thelastofat).
// More info [here](http://www.kesiev.com/?open=454).
//
// ---
//
// **Last warning**
//
// If you don't want to spoil yourself the ending don't read source code
// comments!
//
// *****************************************************************************
// VARIABLES (RE)USAGE MAP
// *****************************************************************************
//
// I: [CN] Tilemap
// A: [CN] Play area maximum size
//
// M: [  ] [ARR-CHR    ] Map
// P: [  ] [INT        ] Current player position
// Z: [  ] [ARR-INT    ] Player inventory
// W: [  ] [INT        ] Destination tile content valued by C
// D: [  ] [INT        ] [SPOILER] flag
// L: [  ] [INT        ] Current zone number
// Q: [  ] [INT        ] Partner position
//
// a,b : Used in function C as arguments
//     : Starting and destination points when adding corridors
// c   : Used in function C as local variable
//
// d   : Backup of player previous position when moving
//     : (MAPGEN) List of lists of walkable spaces in rooms
//     : Map iterator when moving enemies
//     : Screen render string
// e   : Check if player reached the exit
//     : (MAPGEN) Lenght of walkable spaces in rooms
//     : Copy of the map used in order to iterate enemies once
//     : Map iterator when rendering
// f   : (MAPGEN) Map generator room iterator
//     : (MAPGEN) Map filler iterator
//     : (MAPGEN) Map items placement iterator
//     : Map iterator when moving enemies
//     : Current tile when raycasting
// g   : (MAPGEN) Generated room position
// h   : (MAPGEN) Generated room width
// i   : (MAPGEN) Generated room iterator
// j   : (MAPGEN) Check if the generated room is valid
// k   : (MAPGEN) List of empty spaces in generated room
// l   : (MAPGEN) Backup of the map before adding a new room
// m   : (MAPGEN) Current tile filled by room generator
// n   : (MAPGEN) Number of empty spaces in the generated room
// o   : (MAPGEN) Number of accepted rooms
// p   : (MAPGEN) Last room index + 1
// q   : (MAPGEN) Last room list of empty spaces
// r   : (MAPGEN) Last room number of empty spaces
// s   : Check if the turn is valid or not
//
// *****************************************************************************
// TILES
// *****************************************************************************
//
// B: Block sight
// P: Pickable
// S: Spawned when game starts
//
// 0 [ P ] " " : Not visible    | Pickable but never reachable.
// 1 [ P ] "+" : Bandage        |
// 2 [ P ] "/" : Knife          |
// 3 [ P ] "U" : Vial           |
// 4 [   ] "." : Empty space    |
// 5 [  S] "@" : Player         |
// 6 [B S] "^" : Exit           |
// 7 [B  ] "#" : Wall           |
// 8 [B  ] "$" : Partner        |
// 9 [B  ] 1-9 : Enemies        |
//

// This function works in different ways depending on the presence of
// the second argument.
// If b is defined:
// * Moves something in a to the direction b. (UP:2 DOWN:0 LEFT:1 RIGHT:3)
// If b is not defined
// * Generates an integer random number between 0 and a. (excluded)
function C(a,b){
	// Is b specified?
	return b?(
		// Moves something in a to the direction b.
		c=b,
		// Calculates the next position and get the destination tile.
		K=M[
			// Keep the next position in W, so callee can check destination
			// tile if not moved.
			W=b-(
				// Is it an horizontal movement? (1,3)
				a%2?2-a:
				// ...else it is a vertical movement (0,2)
				a*A-A
			)
		],
		// If is an empty space...
		K-4||(
			// Copies the starting position to destination...
			M[c=W]=M[b],
			// ...and set the previous tile to an empty space.
			M[b]=4
		)
		// Freezes return until all of the code is executed :) Thanks uglifyjs!
		,c
	)
	:
	// ...else generates a random number.
	Math.random()*a|0
}

// Initializes the tileset and uses it as a fake game map in order to avoid
// first run errors.
M=I=" +/U.@^#$",

// Size of the play area and fake player starting position in order to avoid
// first run errors.
P=A=50,

// Initializes inventory. Array positions are the same of the tilemap.
Z=[
	// Skipping a space - the "Not visible" tile is not an item...
	,
	// Player starting bandages... (i.e. health)
	5,
	// Player Starting knives... (none)
	0,
	// ...and starting vials. Using this zero to initialize zone index and
	// the [SPOILER] flag.
	D=L=0
];

// Turn handler, renderer and map generation.
onload=onkeydown=function(e){
	// If the player is alive...
	Z[1]>0?
		// Backups position in order to detect movement and moves it depending
		// on the pressed key. (UP:2 DOWN:0 LEFT:1 RIGHT:3)
		P=C(e.which%4,d=P)
	:
		// ...else keep it still.
		W=P;

	// If player hits a tile that is NOT a stair or game is NOT starting...
	s=(e=K-6)&&
		// Is hitting something that is not an enemy?
		K<9?
			// Is it an object? If yes...
			K<4?(
				// ...add to inventory and...
				Z[K]++,
				// remove it from the map.
				M[W]=4
			):
			// So... is the player just moving?
			d-P?
			// If the [SPOILER] flag is not set...
			D||
			(
				// Empty previous partner position...
				M[Q]=4,
				// ...and set new partner position.
				M[Q=d]=8
			)
			:
			// ...else the turn is invalid. Enemies will skip turn too.
			0
		:
			// ...else is hitting an enemy...
			M[W]=
				// If it's strong and...
				K>12&&
				// ...the player has a knife...
				Z[2]?(
					// ...decreases the knife count...
					Z[2]--,
					// ...and drop a bandage, a new knife or a vial.
					1+C(3)
				):
				// If it will survive the attack...
				K>9?
					//  ...decrease its energy,
					K-1
					:
					// ... else kill it. Drop randomly a bandage, a knife or
					// set an empty space.
					C(3)||4;

	// ...else, if it is a stair or game just started, go to the next zone.
	if(!e&&(
		// Zone map and map indexes are initialized...
		M=[],d=[],e=[],
		// ...and current zone index is changed according to the [SPOILER]
		// flag. Zone index can't go below 0.
		D?L>0&&--L:++L
	)){

		// Draw separate rooms:
		// Rooms are randomly generated and overlaps are detected.
		// Overlapping rooms are discarded, except every 2 levels, in order to
		// make a cave. Some rooms can be empty.
		// Empty spaces in rooms are eventually indexed in order to place
		// objects and join them.

		// Every stage more tries of adding rooms are performed in order to
		// have progressively more complex stages.
		for(f=3*L;f--;){
			for(
				// Calculates next room position and width.
				// "32" is given by the game area size (50) minus the maximum
				// room size (9+8=17) and a space on the right of the area as
				// border (1) so (50-17-1=32).
				// Okay. Now is the time to explain the presence of these
				// borders, which are stealing 4 characters.
				// Players and enemies can "warp" from the sides since the map
				// is monodimensional (i.e. when they are moving too much to
				// the right will pop up on the next row on the left). In order
				// to reduce this effect we're adding these damn borders. :)
				g=
					// Y position:
					(1+C(32))*A+
					// X position:
					1+C(32),
				// Room height:
				h=9+C(9),
				// Rooms are mostly squared but can be one next to each other
				// without any wall, so the resulting maze could be irregular.
				i=h*h,
				// Initialize valid room flag...
				j=0,
				// ...and empty spaces indexes.
				k=[],
				// Makes a copy of the map in order to rollback if overlapping.
				l=M.slice()
				// Iterate every space of the generated room.
				;i--;
			)
				// Calculates next tile position and check if is empty.
				// This flag is persistent during room placement so, if a
				// single tile is found filled, the whole room will be marked
				// as overlapping.
				j|=l[m=g+i%h+(i/h|0)*A],
				// Set the tile in the temporary copy of the map.
				l[m]=
					// 1 of 3 of the rooms we'll try to place will be
					// completely empty or...
					f%3&&
					// ...there will be a chance of placing a filled block
					// inside the room instead so...
					C(5)>3?
						// Place a wall...
						7
						:
						// ...or an empty cell.
						(
							// Empty cells are indexed into the "k" in order to
							// join rooms with corridors later. Its length is
							// cached and indexed later if the room will be
							// accepted.
							n=k.push(m),
							// Returns an empty cell.
							4
						);

			// Room and its index are kept if not overlapping (except every 2
			// levels). We will keep a pointer to the last one - it will be
			// joined with the other rooms, acting as "hub".

			// If rooms are not overlapping, except every 2 floors (i.e.
			// cave zone)
			L%3&&j||(
				// Add the room to the room index...
				// Room index length will be used as counter for joining rooms
				// together with corridors and as constant for selecting
				// random rooms when enemies, players and exit will be placed.
				o=p=d.push(q=k),
				// Add its length to the room size index...
				e.push(r=n),
				// ...and accept the copy of the map with the new room.
				M=l
			)
		}

		// Fill remaining empty spaces with walls.
		for(f=A*A;f--;)
			M[f]=M[f]||7;

		// Draw corridors. Every room is joined with the last one that was
		// accepted in the previous phase. Notice that "o" was valued while
		// accepting rooms.
		for(;o--;)
			// Calculates starting and ending point of the corridors.
			// Starts iterating until destination is reached.
			for(
				// Starting from a random space from the iterated room...
				a=d[o][C(e[o])],
				// ...to the last generated one...
				b=q[C(r)];
				// ...it moves a until it reach b.
				a^b;
			)
				M[
					// "a" is moved...
					a+=
					// ...randomly...
					C(2)?
						// ...toward b horizontally...
						a%A>b%A?-1:1:
						// ...or toward b vertically...
						a/A>b/A?-A:A
					// ...and an empty space is placed.
				]=4;

		// Places enemies, player and exit in random rooms and places.
		for(f=5+L;f--;)
			// From the map...
			M[
				// ...a random empty space is picked from a random room.
				// Since the last object placed is the player, its starting
				// position and the partner starting position will be the one
				// of the last placed object.
				Q=P=d[x=C(p)][C(e[x])]
			]=
				// Last 2 items placed are the exit and the player...
				f<2?5+f:
				// ...others are random enemies.
				9+C(9)

	}

	// Prepare a copy of the map in order to iterate enemies just once then
	// look for foes and moves them.
	for(d in e=M.slice())
		// If the player moved...
		s&&
		// ...and is iterating an enemy...
		(f=e[d])>8&&(
			// Move it move it move it...
			C(
				// Is it a large enemy?
				f>10?
					// Moves randomly...
					C(4)
				:
					// ... else try to follow the player.
					C(2)?d%A>P%A?1:3:d/A>P/A?2:0
				,d
			),
			// And if is hitting the player...
			K-5||
				// Damages it. If player died...
				(Z[1]-=f-8)>0||
				// ...and [SPOILER] flag is not set...
				D||(
					// ...apply [SPOILER]. Change the tileset a bit...
					I=" +/U.$v#x",
					// ...and enable the [SPOILER] flag. Does a thing to player
					// health.
					Z[D=1]=5
				)
		);

	// Prepare rendered scene.
	d="";

	// Iterate every tile in the map for rendering and draw the inventory.
	for(e in M){
		// Inventory rendering is nested with map rendering. It is shown for
		// owned items only.
		d=Z[e]>0?" "+I[e]+Z[e]+d:d;
		// Check if tile is visible. It moves along the line between the
		// player and the tile we want to draw.
		for(f=M[e],i=A;i--;)
			// Is there a tile that is blocking view?
			f=M[P+(i*(e%A-P%A)/A|0)+(i*(e/A-P/A)/A|0)*A]>5?
				// Then the tile that is going to be drawn is covered. An empty
				// space is drawn instead...
				// Funny fact: putting an "f" instead of "0" will show the full
				// map every time. I used this over nine thousand times for
				// debugging stuff.
				0
				:
				// ...else keep checking along the line.
				f;
		// Separate map rows with \n and...
		e%A||(d+="\n");
		// ...draw the tile or an empty space.
		d+=I[f]||f-8
	}
	// Finally put everything on web page.
	document.body.innerHTML="<pre>Zone:"+(L||"END")+d
}