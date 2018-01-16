#!/bin/bash
# Nabyl Bennouri - 1/16/2018

# parse arguments
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    -f|--function)
    FUNCTION="$2"
    shift # past argument
    shift # past value
    ;;
    -v|--version)
    VERSION="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# debug
# echo FUNCTION  = "${FUNCTION}"
# echo VERBOSE     = "${VERBOSE}"

# error handling
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

# test call
if [ "${FUNCTION}" == "" ]
then
  echo "Missing function name. Please call a function with the -f switch. Example: -f weather"
  exit
else
  if [ "${FUNCTION}" == "weather" ]
  then
    if [ "${VERSION}" == "" ]
    then
      apex rollback ${FUNCTION}
    else
      apex rollback ${FUNCTION} -v ${VERSION}
    fi
  fi
fi
