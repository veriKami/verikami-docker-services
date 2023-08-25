##: ----------------------------------------------------------------------------
##: shortcuts -> make up | down | ... | end
##: ----------------------------------------------------------------------------

up:
	docker-compose up

upd:
	docker-compose up -d

down:
	docker-compose down -v

downl:
	docker-compose down --rmi local -v --remove-orphans

downa:
	docker-compose down --rmi all -v --remove-orphans

end:
	docker-compose down --rmi all -v --remove-orphans
	rm -rf ./data-postgres
